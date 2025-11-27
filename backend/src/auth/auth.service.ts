import { BadRequestException, ConflictException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { EmailService } from './email.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
    private jwtService: JwtService,
  ) {}

  private buildResetUrl(token: string): string {
    const base = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '');
    return `${base}/reset-password?token=${token}`;
  }

  private validatePasswordStrength(password: string): void {
    if (password.length < 8) {
      throw new BadRequestException('パスワードは8文字以上にしてください。');
    }

    const hasLetter = /[A-Za-z]/.test(password);
    const hasNumber = /\d/.test(password);
    if (!hasLetter || !hasNumber) {
      throw new BadRequestException('パスワードは英字と数字を含めてください。');
    }
  }

  // ==================== Register & Login ====================

  async register(dto: RegisterDto) {
    // Check if user already exists
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: dto.email },
          { username: dto.username },
        ],
      },
    });

    if (existingUser) {
      if (existingUser.email === dto.email) {
        throw new ConflictException('このメールアドレスは既に登録されています。');
      }
      if (existingUser.username === dto.username) {
        throw new ConflictException('このユーザー名は既に使用されています。');
      }
    }

    // Validate password strength
    this.validatePasswordStrength(dto.password);

    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        username: dto.username,
        email: dto.email,
        password_hash: hashedPassword,
        full_name: dto.full_name,
        country: dto.country,
      },
      select: {
        user_id: true,
        username: true,
        email: true,
        full_name: true,
        country: true,
        created_at: true,
      },
    });

    // Generate JWT token
    const token = this.generateToken(user);

    this.logger.log(`New user registered: ${user.email}`);

    return {
      message: 'アカウントが正常に作成されました。',
      user,
      access_token: token,
    };
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return null;
    }

    // Update last login
    await this.prisma.user.update({
      where: { user_id: user.user_id },
      data: { last_login: new Date() },
    });

    const { password_hash, ...result } = user;
    return result;
  }

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto.email, dto.password);
    
    if (!user) {
      throw new UnauthorizedException('メールアドレスまたはパスワードが正しくありません。');
    }

    const token = this.generateToken(user);

    this.logger.log(`User logged in: ${user.email}`);

    return {
      message: 'ログインに成功しました。',
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        profile_image_url: user.profile_image_url,
        country: user.country,
      },
      access_token: token,
    };
  }

  private generateToken(user: any): string {
    const payload = {
      sub: user.user_id,
      email: user.email,
      username: user.username,
    };
    return this.jwtService.sign(payload);
  }

  // ==================== Password Reset ====================


  async requestPasswordReset(dto: ForgotPasswordDto): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });

    // Always return success response to avoid account enumeration.
    const genericMessage =
      'パスワード再設定の案内をメールで送信しました。メールをご確認ください。';

    if (!user) {
      return { message: genericMessage };
    }

    const token = crypto.randomBytes(32).toString('hex');
    const ttlMinutes = Number(process.env.RESET_TOKEN_TTL_MIN ?? 30);
    const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000);

    await this.prisma.passwordResetToken.create({
      data: {
        token,
        user_id: user.user_id,
        expires_at: expiresAt,
      },
    });

    const resetUrl = this.buildResetUrl(token);
    await this.emailService.sendPasswordResetEmail(user.email, resetUrl);

    return { message: genericMessage };
  }

  async verifyResetToken(token: string): Promise<{ valid: boolean }> {
    const record = await this.prisma.passwordResetToken.findUnique({ where: { token } });

    if (
      !record ||
      record.used ||
      record.expires_at.getTime() < Date.now()
    ) {
      return { valid: false };
    }

    return { valid: true };
  }

  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
    const record = await this.prisma.passwordResetToken.findUnique({
      where: { token: dto.token },
      include: { user: true },
    });

    if (!record || record.used) {
      throw new BadRequestException('トークンが無効です。');
    }

    if (record.expires_at.getTime() < Date.now()) {
      throw new BadRequestException('トークンの有効期限が切れています。');
    }

    this.validatePasswordStrength(dto.password);

    const isSameAsOld = await bcrypt.compare(dto.password, record.user.password_hash);
    if (isSameAsOld) {
      throw new BadRequestException('新しいパスワードは以前のものと異なる必要があります。');
    }

    const hashed = await bcrypt.hash(dto.password, 10);

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { user_id: record.user_id },
        data: { password_hash: hashed },
      }),
      this.prisma.passwordResetToken.update({
        where: { token: dto.token },
        data: { used: true, used_at: new Date() },
      }),
      this.prisma.passwordResetToken.updateMany({
        where: { user_id: record.user_id, used: false, token: { not: dto.token } },
        data: { used: true, used_at: new Date() },
      }),
    ]);

    this.logger.log(`Password reset for user_id=${record.user_id}`);
    return { message: 'パスワードをリセットしました。ログイン画面へお進みください。' };
  }
}
