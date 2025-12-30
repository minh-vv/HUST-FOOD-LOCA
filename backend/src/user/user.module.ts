import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { IngredientController } from './ingredient.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { UserAllergyController } from './user-allergy.controller';

@Module({
  imports: [PrismaModule, CloudinaryModule],
  controllers: [UserController, IngredientController, UserAllergyController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
