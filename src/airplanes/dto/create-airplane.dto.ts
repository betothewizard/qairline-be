import { IsString, IsInt, IsOptional } from 'class-validator';

export class CreateAirplaneDto {
  @IsString()
  model: string;

  @IsString()
  manufacturer: string;

  @IsInt()
  seat_capacity: number;

  @IsOptional()
  @IsString()
  airplane_type?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsInt()
  year_of_make?: number;
}
