import { IsUUID, IsString, IsEnum, IsNumber } from 'class-validator';

export class CreateSeatDto {
  @IsString()
  seat_number: string;

  @IsEnum(['economy', 'business', 'first'])
  class: 'economy' | 'business' | 'first';

  @IsNumber()
  price: number;

  @IsUUID()
  flight_id: string;
}
