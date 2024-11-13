// src/dto/car.dto.ts
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Role } from 'src/common/Enum/role.enum';

export class UsersDto {
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @IsString()
  passWord: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsEnum(Role)
  role?: Role;
}
