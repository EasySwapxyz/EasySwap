import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { CommentService } from '../services/comment.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('product/:productId')
  @UseGuards(JwtAuthGuard)
  async create(
    @Param('productId') productId: string,
    @Body('content') content: string,
    @Body('rating') rating: number,
    @Request() req,
  ) {
    return await this.commentService.create({
      content,
      rating,
      productId,
      userId: req.user.id,
    });
  }

  @Get('product/:productId')
  async findByProduct(@Param('productId') productId: string) {
    return await this.commentService.findByProduct(productId);
  }

  @Get('product/:productId/rating')
  async getProductRating(@Param('productId') productId: string) {
    return await this.commentService.getProductRating(productId);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body('content') content: string,
    @Request() req,
  ) {
    return await this.commentService.update(id, req.user.id, content);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string, @Request() req) {
    await this.commentService.delete(id, req.user.id);
    return { message: 'Comment deleted successfully' };
  }

  @Post(':id/like')
  @UseGuards(JwtAuthGuard)
  async toggleLike(
    @Param('id') id: string,
    @Body('like') like: boolean,
  ) {
    if (like) {
      await this.commentService.like(id);
    } else {
      await this.commentService.unlike(id);
    }
    return { message: like ? 'Comment liked' : 'Comment unliked' };
  }
} 