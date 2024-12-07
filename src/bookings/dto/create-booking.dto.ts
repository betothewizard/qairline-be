import {
  IsString,
  IsEnum,
  IsNumber,
  IsUUID,
  IsOptional,
  IsPositive,
  IsArray,
  IsObject,
} from 'class-validator';
import { CreateBookingDetailDto } from 'src/booking-details/dto/create-booking-detail.dto';

export class CreateBookingDto {
  @IsOptional()
  @IsString()
  booking_code?: string; // Mã đặt chỗ (tùy chọn, có thể tự sinh)

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  total_price: number; // Tổng giá trị đặt chỗ

  @IsOptional()
  @IsEnum(['pending', 'confirmed', 'cancelled', 'completed', 'refunded'])
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'refunded'; // Trạng thái đặt chỗ

  @IsUUID()
  user_id: string; // ID của người dùng đặt vé

  @IsUUID()
  flight_id: string; // ID của chuyến bay

  @IsArray()
  @IsObject({ each: true })
  bookingDetails: CreateBookingDetailDto[]; // Mảng các chi tiết đặt chỗ (hành khách và ghế)
}
