import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsArray,
  IsDateString,
} from 'class-validator';

enum DiscountType {
  Fixed = 'fixed',
  Percentage = 'percentage',
}

export class CreatePromotionDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  discountValue: number;

  @IsNotEmpty()
  @IsString()
  discountType: DiscountType;

  @IsString()
  @IsNotEmpty()
  promotionCode: string;

  @IsNotEmpty()
  @IsDateString()
  startDate: Date;

  @IsNotEmpty()
  @IsDateString()
  endDate: Date;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsArray()
  @IsString({ each: true }) // Mỗi phần tử trong mảng là chuỗi
  flightCodes: string[];
}
