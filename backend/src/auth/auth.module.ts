import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { EmailService } from './email.service';

@Module({
  imports: [PrismaModule],
  controllers: [AuthController],
  providers: [AuthService, EmailService],
})
export class AuthModule {}
