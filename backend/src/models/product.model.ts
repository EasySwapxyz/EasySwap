import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.model';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('simple-array')
  images: string[];

  @Column()
  category: string;

  @Column()
  condition: string;

  @Column({ default: true })
  isAvailable: boolean;

  @Column({ type: 'jsonb', nullable: true })
  metadata: {
    brand?: string;
    model?: string;
    size?: string;
    color?: string;
    purchaseYear?: number;
  };

  @Column({ type: 'point', nullable: true })
  location: { x: number; y: number };

  @ManyToOne(() => User)
  @JoinColumn({ name: 'sellerId' })
  seller: User;

  @Column()
  sellerId: string;

  @Column({ default: 0 })
  viewCount: number;

  @Column({ default: 0 })
  favoriteCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 