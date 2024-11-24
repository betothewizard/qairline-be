import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsArray, ArrayNotEmpty } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty()
  @IsUUID()
  user_id: string;

  @ApiProperty()
  @IsUUID()
  flight_id: string;

  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  seat_ids: string[];
}
