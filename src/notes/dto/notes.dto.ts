// src/dto/car.dto.ts
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class NotesDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3, { message: 'Tiêu đề phải có ít nhất 3 kí tự' })
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;
}
