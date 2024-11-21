import { IsUUID, IsArray, ArrayNotEmpty } from 'class-validator';

export class CreateBookingDto {
  @IsUUID()
  user_id: string;

  @IsUUID()
  flight_id: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  seat_ids: string[];
}
