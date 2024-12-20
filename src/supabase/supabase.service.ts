// src/supabase/supabase.service.ts
import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { Express } from 'express'; // Import đúng kiểu Express
//import { Multer } from 'multer'; // Đảm bảo rằng bạn đã cài đặt @types/multer

@Injectable()
export class SupabaseService {
  private supabase;

  constructor() {
    const SUPABASE_URL = 'https://tzdgiitstqigcgmyjjhy.supabase.co';
    const SUPABASE_API_KEY =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6ZGdpaXRzdHFpZ2NnbXlqamh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg3MTgzNjQsImV4cCI6MjA0NDI5NDM2NH0.bYCAUynuVZxIJGu9DEex9vjpIatmCR-B7MBsHKOP3ts';

    this.supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);
  }

  // Tải ảnh lên Supabase Storage
  async uploadFile(bucket: string, file: Express.Multer.File): Promise<string> {
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .upload(file.originalname, file.buffer, {
        upsert: true,
      });

    if (error) {
      throw new Error('Error uploading file: ' + error.message);
    }

    return data?.path ?? '';
  }

  // Lấy URL ảnh
  async getFileUrl(bucket: string, filePath: string): Promise<string> {
    const { publicURL, error } = this.supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    if (error) {
      throw new Error('Error getting file URL: ' + error.message);
    }

    return publicURL;
  }
}
