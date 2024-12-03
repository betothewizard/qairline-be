import { IsNotEmpty, IsUUID, IsDecimal, IsArray } from 'class-validator';

export class CreateBookingDto {
  @IsUUID()
  @IsNotEmpty()
  flightId: string;

  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsDecimal()
  totalPrice: number;

  @IsArray()
  bookingDetails: any[]; // Replace with BookingDetail DTO if available
}
