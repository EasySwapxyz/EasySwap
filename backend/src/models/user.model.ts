import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  username: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ type: 'enum', enum: ['user', 'admin'], default: 'user' })
  role: string;

  @Column({ default: 0 })
  reputationScore: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 