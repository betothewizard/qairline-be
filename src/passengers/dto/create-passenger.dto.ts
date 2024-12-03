import { IsString, IsInt, Min, MaxLength } from 'class-validator';

export class CreatePassengerDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsInt()
  @Min(0)
  age: number;

  @IsString()
  passportNumber: string;
}
