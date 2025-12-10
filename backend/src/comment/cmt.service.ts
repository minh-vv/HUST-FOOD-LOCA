import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CmtService {
	constructor(private prisma: PrismaService) {}

	async findByMenuId(menuId: number, page = 1, limit = 20) {
		if (!menuId || Number.isNaN(menuId)) {
			throw new BadRequestException('Invalid menu id');
		}

		const take = Math.min(limit, 100);
		const skip = (page - 1) * take;

		const [count, reviews] = await Promise.all([
			this.prisma.review.count({ where: { menu_id: menuId } }),
			this.prisma.review.findMany({
				where: { menu_id: menuId },
				orderBy: { created_at: 'desc' },
				include: { user: { select: { user_id: true, username: true, full_name: true, profile_image_url: true } } },
				skip,
				take,
			}),
		]);

		return { count, page, limit: take, data: reviews };
	}

	async createReview(userId: number, payload: { menu_id: number; rating: number; comment?: string }) {
		const { menu_id, rating, comment } = payload;

		if (!rating || rating < 1 || rating > 5) {
			throw new BadRequestException('Rating must be an integer between 1 and 5');
		}

		if (!comment || comment.trim().length === 0) {
			throw new BadRequestException('Comment content cannot be empty');
		}

		if (!menu_id) {
			throw new BadRequestException('menu_id is required');
		}

		const review = await this.prisma.review.create({
			data: {
				user_id: userId,
				menu_id,
				rating,
				comment,
			},
			include: { user: { select: { user_id: true, username: true, full_name: true, profile_image_url: true } } },
		});

		return review;
	}

	async updateReview(reviewId: number, userId: number, payload: { rating?: number; comment?: string }) {
		const review = await this.prisma.review.findUnique({ where: { review_id: reviewId } });
		if (!review) throw new NotFoundException('Review not found');
		if (review.user_id !== userId) throw new ForbiddenException('Not authorized to edit this review');

		if (payload.rating !== undefined) {
			if (payload.rating < 1 || payload.rating > 5) throw new BadRequestException('Rating must be between 1 and 5');
		}
		if (payload.comment !== undefined) {
			if (!payload.comment || payload.comment.trim().length === 0) throw new BadRequestException('Comment content cannot be empty');
		}

		const updated = await this.prisma.review.update({
			where: { review_id: reviewId },
			data: { rating: payload.rating ?? review.rating, comment: payload.comment ?? review.comment },
			include: { user: { select: { user_id: true, username: true, full_name: true, profile_image_url: true } } },
		});

		return updated;
	}

	async deleteReview(reviewId: number, userId: number) {
		const review = await this.prisma.review.findUnique({ where: { review_id: reviewId } });
		if (!review) throw new NotFoundException('Review not found');
		if (review.user_id !== userId) throw new ForbiddenException('Not authorized to delete this review');

		await this.prisma.review.delete({ where: { review_id: reviewId } });

		return { message: 'Review deleted' };
	}
}
