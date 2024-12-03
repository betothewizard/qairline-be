// src/booking-details/dto/create-booking-detail.dto.ts
import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreateBookingDetailDto {
  @IsNotEmpty()
  @IsUUID()
  booking_id: string;

  @IsNotEmpty()
  @IsUUID()
  passenger_id: string;

  @IsNotEmpty()
  @IsUUID()
  seat_id: string;

  @IsNotEmpty()
  @IsUUID()
  flight_id: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;
}
