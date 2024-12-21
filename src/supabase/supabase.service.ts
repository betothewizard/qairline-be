import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Express } from 'express';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    const SUPABASE_URL = 'https://tzdgiitstqigcgmyjjhy.supabase.co';
    const SUPABASE_API_KEY =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6ZGdpaXRzdHFpZ2NnbXlqamh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg3MTgzNjQsImV4cCI6MjA0NDI5NDM2NH0.bYCAUynuVZxIJGu9DEex9vjpIatmCR-B7MBsHKOP3ts';

    this.supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);
  }

  /**
   * Upload file lên Supabase Storage
   * @param bucket Tên bucket trong Supabase
   * @param file File được upload (từ Multer)
   * @returns Đường dẫn file trong bucket
   */
  async uploadFile(bucket: string, file: Express.Multer.File): Promise<string> {
    const fileName = `${Date.now()}-${file.originalname}`;
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: true, // Ghi đè nếu file đã tồn tại
      });

    if (error) {
      throw new Error(`Error uploading file: ${error.message}`);
    }

    return data?.path ?? ''; // Trả về đường dẫn file trong bucket
  }

  /**
   * Lấy public URL của file từ Supabase Storage
   * @param bucket Tên bucket
   * @param filePath Đường dẫn file trong bucket
   * @returns Public URL của file
   */
  async getFileUrl(bucket: string, filePath: string): Promise<string> {
    const { data } = this.supabase.storage.from(bucket).getPublicUrl(filePath);

    return data.publicUrl; // Trả về URL public
  }
}
