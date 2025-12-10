import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
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

@Controller('comments')
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

	// POST /comments
	@UseGuards(JwtAuthGuard)
	@Post()
	async create(
		@Body() dto: CreateReviewDto,
		@CurrentUser() user: any,
	) {
		const created = await this.cmtService.createReview(user.user_id, dto as any);
		return { data: created };
	}

	// PUT /comments/:id
	@UseGuards(JwtAuthGuard)
	@Put(':id')
	async update(
		@Param('id', ParseIntPipe) id: number,
		@Body() dto: UpdateReviewDto,
		@CurrentUser() user: any,
	) {
		const updated = await this.cmtService.updateReview(id, user.user_id, dto as any);
		return { data: updated };
	}

	// DELETE /comments/:id
	@UseGuards(JwtAuthGuard)
	@Delete(':id')
	async remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: any) {
		await this.cmtService.deleteReview(id, user.user_id);
		return { message: 'Deleted' };
	}
}
