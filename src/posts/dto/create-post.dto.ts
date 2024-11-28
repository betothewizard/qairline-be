import {
  IsString,
  IsEnum,
  IsBoolean,
  IsOptional,
  IsDateString,
  IsArray,
} from 'class-validator';
import { PostType } from '../enum/post-type.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty()
  @IsEnum(PostType)
  @IsOptional()
  type?: PostType;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  startAt?: Date;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  endAt?: Date;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  // Mảng URL hình ảnh
  @ApiProperty()
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  imageUrls?: string[];
}
