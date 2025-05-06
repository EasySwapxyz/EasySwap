import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../models/product.model';
import { ProductService } from '../services/product.service';
import { ProductController } from '../controllers/product.controller';
import { UploadModule } from './upload.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    UploadModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {} 