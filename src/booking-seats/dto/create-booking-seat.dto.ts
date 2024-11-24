import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty } from 'class-validator';

export class CreateBookingSeatDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  booking_id: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  seat_id: string;
}
