import { Injectable, Logger } from '@nestjs/common';
import nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT
      ? Number(process.env.SMTP_PORT)
      : undefined;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (host && port && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });
    } else {
      this.logger.warn(
        'SMTP settings missing; emails will be logged instead of sent.',
      );
    }
  }

  async sendPasswordResetEmail(to: string, resetUrl: string): Promise<void> {
    if (!this.transporter) {
      this.logger.log(`Password reset email to ${to}: ${resetUrl}`);
      return;
    }

    await this.transporter.sendMail({
      from:
        process.env.SMTP_FROM ??
        process.env.SMTP_USER ??
        'no-reply@example.com',
      to,
      subject: 'パスワード再設定のご案内',
      html: `
        <p>パスワード再設定のご依頼を受け付けました。</p>
        <p>以下のリンクから新しいパスワードを設定してください。</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>このリンクは一定時間後に無効になります。</p>
      `,
    });
  }
}
