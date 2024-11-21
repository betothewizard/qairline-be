import { IsUUID, IsNotEmpty } from 'class-validator';

export class CreateBookingSeatDto {
  @IsUUID()
  @IsNotEmpty()
  booking_id: string;

  @IsUUID()
  @IsNotEmpty()
  seat_id: string;
}
