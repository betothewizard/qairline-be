import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, IsDateString } from 'class-validator';

export class UpdateAirplaneDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  model?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  manufacturer?: string;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  seat_capacity?: number;

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

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  last_service_at?: Date;
}
