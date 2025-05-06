import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request, UseInterceptors, UploadedFiles, BadRequestException } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { UploadService } from '../services/upload.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';

@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('images', 5))
  async create(
    @Body() productData: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Request() req,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('At least one image is required');
    }

    const imageUrls = await Promise.all(
      files.map(file => this.uploadService.saveFile(file))
    );

    const product = await this.productService.create(
      {
        ...productData,
        images: imageUrls,
      },
      req.user.id
    );

    return product;
  }

  @Get()
  async findAll(
    @Query('category') category?: string,
    @Query('condition') condition?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('isAvailable') isAvailable?: boolean,
    @Query('search') search?: string,
  ) {
    const filters = {
      category,
      condition,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : undefined,
      search,
    };
    return await this.productService.findAll(filters);
  }

  @Get('search')
  async search(@Query('q') searchTerm: string) {
    return await this.productService.search(searchTerm);
  }

  @Get('similar/:id')
  async findSimilar(@Param('id') id: string) {
    return await this.productService.findSimilarProducts(id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const product = await this.productService.findOne(id);
    await this.productService.incrementViewCount(id);
    return product;
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateData: UpdateProductDto,
    @Request() req,
  ) {
    return await this.productService.update(id, updateData, req.user.id);
  }

  @Put(':id/images')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('images', 5))
  async updateImages(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Request() req,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('At least one image is required');
    }

    const product = await this.productService.findOne(id);
    
    if (product.sellerId !== req.user.id) {
      throw new BadRequestException('You can only update your own products');
    }

    // Delete old images
    await Promise.all(
      product.images.map(image => this.uploadService.deleteFile(image))
    );

    // Upload new images
    const imageUrls = await Promise.all(
      files.map(file => this.uploadService.saveFile(file))
    );

    return await this.productService.update(id, { images: imageUrls }, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string, @Request() req) {
    const product = await this.productService.findOne(id);
    
    // Delete associated images
    await Promise.all(
      product.images.map(image => this.uploadService.deleteFile(image))
    );

    await this.productService.delete(id, req.user.id);
    return { message: 'Product deleted successfully' };
  }

  @Get('seller/:sellerId')
  async findBySeller(@Param('sellerId') sellerId: string) {
    return await this.productService.findBySeller(sellerId);
  }

  @Post(':id/favorite')
  @UseGuards(JwtAuthGuard)
  async toggleFavorite(@Param('id') id: string, @Body('favorite') favorite: boolean) {
    await this.productService.toggleFavorite(id, favorite);
    return { message: favorite ? 'Product added to favorites' : 'Product removed from favorites' };
  }
} 