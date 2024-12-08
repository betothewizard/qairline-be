import {
  IsNotEmpty,
  IsString,
  IsDateString,
  IsInt,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SearchRoundTripFlightDto {
  @IsNotEmpty()
  @IsString()
  departure: string;

  @IsNotEmpty()
  @IsString()
  arrival: string;

  @IsNotEmpty()
  @IsDateString()
  departure_date: string;

  @IsNotEmpty()
  @IsDateString()
  return_date: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  adults: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  children: number;
}
