import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

const mkdirAsync = promisify(fs.mkdir);
const unlinkAsync = promisify(fs.unlink);

@Injectable()
export class UploadService {
  private uploadDir: string;

  constructor(private configService: ConfigService) {
    this.uploadDir = this.configService.get('UPLOAD_DIR', 'uploads');
    this.ensureUploadDirectory();
  }

  private async ensureUploadDirectory() {
    try {
      await mkdirAsync(this.uploadDir, { recursive: true });
    } catch (error) {
      if (error.code !== 'EEXIST') {
        throw error;
      }
    }
  }

  async saveFile(file: Express.Multer.File): Promise<string> {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = `${uniqueSuffix}-${file.originalname}`;
    const filepath = path.join(this.uploadDir, filename);
    
    await fs.promises.writeFile(filepath, file.buffer);
    
    // 返回相对路径，这样在前端更容易处理
    return `/${this.uploadDir}/${filename}`;
  }

  async deleteFile(fileUrl: string): Promise<void> {
    try {
      // 从URL中提取文件路径
      const filepath = fileUrl.startsWith('/') ? fileUrl.slice(1) : fileUrl;
      await unlinkAsync(filepath);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
  }

  getFilePath(filename: string): string {
    return path.join(this.uploadDir, filename);
  }
} 