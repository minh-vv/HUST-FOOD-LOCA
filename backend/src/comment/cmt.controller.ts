import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards, ParseIntPipe, DefaultValuePipe, BadRequestException } from '@nestjs/common';
import { CmtService } from './cmt.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

class CreateReviewDto {
	menu_id: number;
	rating: number;
	comment: string;
}

class UpdateReviewDto {
	rating?: number;
	comment?: string;
}

@Controller('api/comments')
export class CmtController {
	constructor(private readonly cmtService: CmtService) {}

	// GET /comments/menu/:menuId?page=1&limit=20
	@Get('menu/:menuId')
	async getByMenu(
		@Param('menuId', ParseIntPipe) menuId: number,
		@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
		@Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
	) {
		const result = await this.cmtService.findByMenuId(menuId, page, limit);
		return {
			data: result.data,
			meta: { total: result.count, page: result.page, limit: result.limit },
		};
	}

	// POST /api/comments
	@UseGuards(JwtAuthGuard)
	@Post()
	async create(
		@Body() dto: any,
		@CurrentUser() user: any,
	) {
		// Validate và lọc properties - chỉ cho phép menu_id, rating, comment
		const allowedKeys = ['menu_id', 'rating', 'comment'];
		const hasInvalidKeys = Object.keys(dto).some(key => !allowedKeys.includes(key));
		
		if (hasInvalidKeys) {
			const invalidKeys = Object.keys(dto).filter(key => !allowedKeys.includes(key));
			throw new BadRequestException(`Invalid properties: ${invalidKeys.join(', ')}`);
		}

		const cleanDto = {
			menu_id: dto.menu_id,
			rating: dto.rating,
			comment: dto.comment,
		};

		const created = await this.cmtService.createReview(user.user_id, cleanDto as any);
		return { data: created };
	}

	// PUT /api/comments/:id
	@UseGuards(JwtAuthGuard)
	@Put(':id')
	async update(
		@Param('id', ParseIntPipe) id: number,
		@Body() dto: any,
		@CurrentUser() user: any,
	) {
		// Validate - chỉ cho phép rating, comment (không được sửa menu_id)
		const allowedKeys = ['rating', 'comment'];
		const hasInvalidKeys = Object.keys(dto).some(key => !allowedKeys.includes(key));
		
		if (hasInvalidKeys) {
			const invalidKeys = Object.keys(dto).filter(key => !allowedKeys.includes(key));
			throw new BadRequestException(`Invalid properties: ${invalidKeys.join(', ')}`);
		}

		const cleanDto = {
			rating: dto.rating,
			comment: dto.comment,
		};

		const updated = await this.cmtService.updateReview(id, user.user_id, cleanDto as any);
		return { data: updated };
	}

	// PATCH /api/comments/:id (alternative to PUT)
	@UseGuards(JwtAuthGuard)
	@Patch(':id')
	async partialUpdate(
		@Param('id', ParseIntPipe) id: number,
		@Body() dto: any,
		@CurrentUser() user: any,
	) {
		// Validate - chỉ cho phép rating, comment (không được sửa menu_id)
		const allowedKeys = ['rating', 'comment'];
		const hasInvalidKeys = Object.keys(dto).some(key => !allowedKeys.includes(key));
		
		if (hasInvalidKeys) {
			const invalidKeys = Object.keys(dto).filter(key => !allowedKeys.includes(key));
			throw new BadRequestException(`Invalid properties: ${invalidKeys.join(', ')}`);
		}

		const cleanDto = {
			rating: dto.rating,
			comment: dto.comment,
		};

		const updated = await this.cmtService.updateReview(id, user.user_id, cleanDto as any);
		return { data: updated };
	}

	// DELETE /api/comments/:id
	@UseGuards(JwtAuthGuard)
	@Delete(':id')
	async remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: any) {
		await this.cmtService.deleteReview(id, user.user_id);
		return { message: 'Deleted' };
	}
}
