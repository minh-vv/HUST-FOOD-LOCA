import { Controller, Get, Post, Delete, Body, UseGuards, Req } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('user/allergy')
@UseGuards(JwtAuthGuard)
export class UserAllergyController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async getUserAllergies(@Req() req) {
    const user_id = req.user.user_id;
    const allergies = await this.prisma.userAllergy.findMany({
      where: { user_id },
      include: { ingredient: true },
    });
    return allergies.map(a => ({
      ingredient_id: a.ingredient_id,
      ingredient_name: a.ingredient.ingredient_name,
    }));
  }

  @Post()
  async addUserAllergy(@Req() req, @Body() body: { ingredient_id: number }) {
    const user_id = req.user.user_id;
    const { ingredient_id } = body;
    await this.prisma.userAllergy.create({
      data: { user_id, ingredient_id },
    });
    return { success: true };
  }

  @Delete()
  async removeUserAllergy(@Req() req, @Body() body: { ingredient_id: number }) {
    const user_id = req.user.user_id;
    const { ingredient_id } = body;
    await this.prisma.userAllergy.deleteMany({
      where: { user_id, ingredient_id },
    });
    return { success: true };
  }
}
