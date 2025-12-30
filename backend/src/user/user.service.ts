
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { user_id: userId },
      select: {
        user_id: true,
        username: true,
        email: true,
        full_name: true,
        profile_image_url: true,
        created_at: true,
        updated_at: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateAvatar(userId: number, file: Express.Multer.File) {
    if (!file) throw new NotFoundException('No file uploaded');
    const upload = await this.cloudinary.uploadImage(file.buffer, 'avatars');
    const user = await this.prisma.user.update({
      where: { user_id: userId },
      data: { profile_image_url: upload.secure_url },
      select: {
        user_id: true,
        profile_image_url: true,
      },
    });
    return user;
  }
}
