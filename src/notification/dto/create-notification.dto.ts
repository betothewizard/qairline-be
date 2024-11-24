import {
  IsString,
  IsEnum,
  IsBoolean,
  IsOptional,
  IsDateString,
  IsArray,
} from 'class-validator';
import { NotificationType } from '../enum/notification-type.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNotificationDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty()
  @IsEnum(NotificationType)
  @IsOptional()
  type?: NotificationType;

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
