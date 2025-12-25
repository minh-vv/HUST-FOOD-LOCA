import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { SearchModule } from './search/search.module';
import { HomeModule } from './home/home.module';
import { MenuModule } from './menu/menu.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { CmtModule } from './comment/cmt.module';
import { FavoritesModule } from './favorites/favorites.module';
import { SavedModule } from './saved/saved.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    SearchModule,
    HomeModule,
    MenuModule,
    RestaurantModule,
    CmtModule,
    FavoritesModule,
    SavedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }


