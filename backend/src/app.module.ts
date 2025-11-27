import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { SearchModule } from './search/search.module';
import { HomeModule } from './home/home.module';
@Module({
  imports: [PrismaModule, AuthModule, SearchModule, HomeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
