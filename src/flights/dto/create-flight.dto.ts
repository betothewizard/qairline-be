import { IsString, IsEnum, IsNumber, IsDateString } from 'class-validator';

export class CreateFlightDto {
  @IsString()
  flight_code: string;

  @IsString()
  airline: string;

  @IsString()
  origin: string;

  @IsString()
  destination: string;

  @IsDateString()
  departure_time: Date;

  @IsDateString()
  arrival_time: Date;

  @IsEnum(['scheduled', 'delayed', 'canceled', 'completed'])
  status: 'scheduled' | 'delayed' | 'canceled' | 'completed';

  @IsNumber()
  price: number;
}
