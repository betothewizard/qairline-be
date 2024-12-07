import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsNumber, IsDateString } from 'class-validator';

export class CreateFlightDto {
  @ApiProperty()
  @IsString()
  flight_code: string;

  @ApiProperty()
  @IsString()
  airline: string;

  @ApiProperty()
  @IsString()
  origin: string;

  @ApiProperty()
  @IsString()
  destination: string;

  @ApiProperty()
  @IsDateString()
  departure_time: Date;

  @ApiProperty()
  @IsDateString()
  arrival_time: Date;

  @ApiProperty()
  @IsNumber()
  total_seats: number;

  @ApiProperty()
  @IsEnum(['scheduled', 'delayed', 'canceled', 'completed'])
  status: 'scheduled' | 'delayed' | 'canceled' | 'completed';
}
