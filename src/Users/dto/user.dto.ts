// src/dto/car.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class UsersDto {
  @IsNotEmpty()
  @IsString()
  userName: string;

  @IsNotEmpty()
  @IsString()
  passWord: string;
}
