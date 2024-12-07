import { IsUUID, IsNotEmpty } from 'class-validator';

export class CreateBookingDetailDto {
  @IsUUID()
  @IsNotEmpty()
  seat_id: string; // ID của ghế (để liên kết với bảng Seat)

  @IsUUID()
  @IsNotEmpty()
  passenger_id: string; // ID của hành khách (để liên kết với bảng Passenger)

  @IsUUID()
  @IsNotEmpty()
  booking_id: string; // ID của booking (để liên kết với bảng Booking)
}
