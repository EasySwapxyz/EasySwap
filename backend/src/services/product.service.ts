import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, ILike } from 'typeorm';
import { Product } from '../models/product.model';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(productData: Partial<Product>, sellerId: string): Promise<Product> {
    const product = this.productRepository.create({
      ...productData,
      sellerId,
    });
    return await this.productRepository.save(product);
  }

  async findAll(filters?: {
    category?: string;
    condition?: string;
    minPrice?: number;
    maxPrice?: number;
    isAvailable?: boolean;
    search?: string;
  }): Promise<Product[]> {
    const query = this.productRepository.createQueryBuilder('product');
    query.leftJoinAndSelect('product.seller', 'seller');

    if (filters) {
      if (filters.search) {
        query.where(
          '(product.title ILIKE :search OR product.description ILIKE :search OR product.category ILIKE :search)',
          { search: `%${filters.search}%` }
        );
      }
      if (filters.category) {
        query.andWhere('product.category = :category', { category: filters.category });
      }
      if (filters.condition) {
        query.andWhere('product.condition = :condition', { condition: filters.condition });
      }
      if (filters.minPrice) {
        query.andWhere('product.price >= :minPrice', { minPrice: filters.minPrice });
      }
      if (filters.maxPrice) {
        query.andWhere('product.price <= :maxPrice', { maxPrice: filters.maxPrice });
      }
      if (filters.isAvailable !== undefined) {
        query.andWhere('product.isAvailable = :isAvailable', { isAvailable: filters.isAvailable });
      }
    }

    query.orderBy('product.createdAt', 'DESC');
    return await query.getMany();
  }

  async search(searchTerm: string): Promise<Product[]> {
    const query = this.productRepository.createQueryBuilder('product');
    query.leftJoinAndSelect('product.seller', 'seller');

    if (searchTerm) {
      query.where(
        '(product.title ILIKE :search OR product.description ILIKE :search OR product.category ILIKE :search OR CAST(product.metadata AS TEXT) ILIKE :search)',
        { search: `%${searchTerm}%` }
      );
    }

    query.orderBy('product.viewCount', 'DESC')
         .addOrderBy('product.favoriteCount', 'DESC')
         .addOrderBy('product.createdAt', 'DESC');

    return await query.getMany();
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({ 
      where: { id },
      relations: ['seller']
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async update(id: string, updateData: Partial<Product>, userId: string): Promise<Product> {
    const product = await this.findOne(id);
    
    if (product.sellerId !== userId) {
      throw new BadRequestException('You can only update your own products');
    }

    await this.productRepository.update(id, updateData);
    return await this.findOne(id);
  }

  async delete(id: string, userId: string): Promise<void> {
    const product = await this.findOne(id);
    
    if (product.sellerId !== userId) {
      throw new BadRequestException('You can only delete your own products');
    }

    await this.productRepository.delete(id);
  }

  async incrementViewCount(id: string): Promise<void> {
    await this.productRepository.increment({ id }, 'viewCount', 1);
  }

  async toggleFavorite(id: string, increment: boolean): Promise<void> {
    await this.productRepository.increment(
      { id },
      'favoriteCount',
      increment ? 1 : -1
    );
  }

  async findBySeller(sellerId: string): Promise<Product[]> {
    return await this.productRepository.find({ 
      where: { sellerId },
      relations: ['seller'],
      order: { createdAt: 'DESC' }
    });
  }

  async findSimilarProducts(productId: string): Promise<Product[]> {
    const product = await this.findOne(productId);
    
    const query = this.productRepository.createQueryBuilder('product');
    query.leftJoinAndSelect('product.seller', 'seller')
         .where('product.category = :category', { category: product.category })
         .andWhere('product.id != :id', { id: productId })
         .orderBy('product.viewCount', 'DESC')
         .addOrderBy('product.favoriteCount', 'DESC')
         .take(5);

    return await query.getMany();
  }
} 