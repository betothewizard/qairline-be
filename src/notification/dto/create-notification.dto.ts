import {
  IsString,
  IsEnum,
  IsBoolean,
  IsOptional,
  IsDateString,
  IsArray,
} from 'class-validator';
import { NotificationType } from '../enum/notification-type.enum';

export class CreateNotificationDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsEnum(NotificationType)
  @IsOptional()
  type?: NotificationType;

  @IsDateString()
  @IsOptional()
  startAt?: Date;

  @IsDateString()
  @IsOptional()
  endAt?: Date;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  // Mảng URL hình ảnh
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  imageUrls?: string[];
}
