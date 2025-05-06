import { IsString, IsNumber, IsArray, IsOptional, IsEnum, IsBoolean, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ProductMetadata {
  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsString()
  size?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsNumber()
  purchaseYear?: number;
}

class Location {
  @IsNumber()
  x: number;

  @IsNumber()
  y: number;
}

export class CreateProductDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  category: string;

  @IsEnum(['new', 'like-new', 'good', 'fair', 'poor'])
  condition: string;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @IsOptional()
  @ValidateNested()
  @Type(() => ProductMetadata)
  metadata?: ProductMetadata;

  @IsOptional()
  @ValidateNested()
  @Type(() => Location)
  location?: Location;
} 