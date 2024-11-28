import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class SearchFlight {
  @IsString()
  @IsNotEmpty()
  departure: string;

  @IsString()
  @IsNotEmpty()
  arrival: string;

  @IsDateString()
  @IsNotEmpty()
  departure_date: string;
}
