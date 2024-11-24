import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional } from 'class-validator';

export class CreateAirplaneDto {
  @ApiProperty()
  @IsString()
  model: string;

  @ApiProperty()
  @IsString()
  manufacturer: string;

  @ApiProperty()
  @IsInt()
  seat_capacity: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  airplane_type?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  year_of_make?: number;
}
