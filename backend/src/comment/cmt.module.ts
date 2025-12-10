import { Module } from '@nestjs/common';
import { CmtService } from './cmt.service';
import { CmtController } from './cmt.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
	imports: [PrismaModule, AuthModule],
	controllers: [CmtController],
	providers: [CmtService],
})
export class CmtModule {}
