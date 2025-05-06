import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UploadService } from '../services/upload.service';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        dest: configService.get('UPLOAD_DIR', 'uploads'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {} 