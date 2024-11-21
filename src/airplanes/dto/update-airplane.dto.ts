import { IsOptional, IsString, IsInt, IsDateString } from 'class-validator';

export class UpdateAirplaneDto {
  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsString()
  manufacturer?: string;

  @IsOptional()
  @IsInt()
  seat_capacity?: number;

  @IsOptional()
  @IsString()
  airplane_type?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsInt()
  year_of_make?: number;

  @IsOptional()
  @IsDateString()
  last_service_at?: Date;
}
