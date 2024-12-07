import { ApiProperty } from '@nestjs/swagger';
import {
  IsUUID,
  IsString,
  IsEnum,
  IsNumber,
  IsNotEmpty,
} from 'class-validator';

export class CreateSeatDto {
  @ApiProperty()
  @IsString()
  seat_number: string;

  @IsEnum(['Business', 'SkyBoss', 'Deluxe', 'Eco'])
  @IsNotEmpty()
  ticket_class: 'Business' | 'SkyBoss' | 'Deluxe' | 'Eco';

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsUUID()
  flight_id: string;
}
