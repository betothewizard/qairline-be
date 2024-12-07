import {
  IsEnum,
  IsOptional,
  IsString,
  IsDateString,
  Length,
} from 'class-validator';

export class CreatePassengerDto {
  @IsEnum(['adult', 'child'])
  type: 'adult' | 'child';

  @IsEnum(['male', 'female', 'other'])
  gender: 'male' | 'female' | 'other';

  @IsString()
  @Length(1, 50)
  firstName: string;

  @IsString()
  @Length(1, 50)
  lastName: string;

  @IsDateString()
  dateOfBirth: string;

  @IsString()
  @IsOptional()
  @Length(1, 50)
  nationality?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  idCardOrPassport?: string;

  @IsString()
  @IsOptional()
  currentAddress?: string;
}
