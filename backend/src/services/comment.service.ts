import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../models/comment.model';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  async create(commentData: Partial<Comment>): Promise<Comment> {
    const comment = this.commentRepository.create(commentData);
    return await this.commentRepository.save(comment);
  }

  async findByProduct(productId: string): Promise<Comment[]> {
    return await this.commentRepository.find({
      where: { productId },
      relations: ['user'],
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: string): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['user']
    });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    return comment;
  }

  async update(id: string, userId: string, content: string): Promise<Comment> {
    const comment = await this.findOne(id);
    
    if (comment.userId !== userId) {
      throw new BadRequestException('You can only update your own comments');
    }

    await this.commentRepository.update(id, { content });
    return await this.findOne(id);
  }

  async delete(id: string, userId: string): Promise<void> {
    const comment = await this.findOne(id);
    
    if (comment.userId !== userId) {
      throw new BadRequestException('You can only delete your own comments');
    }

    await this.commentRepository.delete(id);
  }

  async like(id: string): Promise<void> {
    await this.commentRepository.increment({ id }, 'likes', 1);
  }

  async unlike(id: string): Promise<void> {
    await this.commentRepository.increment({ id }, 'likes', -1);
  }

  async getProductRating(productId: string): Promise<{ average: number; total: number }> {
    const result = await this.commentRepository
      .createQueryBuilder('comment')
      .select('AVG(comment.rating)', 'average')
      .addSelect('COUNT(comment.id)', 'total')
      .where('comment.productId = :productId', { productId })
      .getRawOne();

    return {
      average: Number(result.average) || 0,
      total: Number(result.total) || 0
    };
  }
} 