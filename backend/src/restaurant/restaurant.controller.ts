import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  NotFoundException,
  ParseIntPipe,
  HttpException,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { RestaurantDetailResponseDto } from './dto/restaurant-detail-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

/**
 * Controller for restaurant-related API endpoints.
 * Handles requests for retrieving restaurant details, favorites, and ratings.
 */
@Controller('api/restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  /**
   * GET /api/restaurant/:id
   * Retrieves the details of a restaurant by its ID.
   * @param id The ID of the restaurant to retrieve.
   * @returns {Promise<RestaurantDetailResponseDto>} The details of the restaurant.
   * @throws {NotFoundException} If the restaurant is not found.
   * @throws {HttpException} For internal server errors.
   */
  @Get(':id')
  async getRestaurantDetail(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<RestaurantDetailResponseDto> {
    const restaurant = await this.restaurantService.getRestaurantDetail(id);
    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }
    return restaurant;
  }
}
