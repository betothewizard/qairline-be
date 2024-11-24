import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsString, IsEnum, IsNumber } from 'class-validator';

export class CreateSeatDto {
  @ApiProperty()
  @IsString()
  seat_number: string;

  @ApiProperty()
  @IsEnum(['economy', 'business', 'first'])
  class: 'economy' | 'business' | 'first';

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsUUID()
  flight_id: string;
}
