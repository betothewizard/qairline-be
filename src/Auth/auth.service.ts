import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/Users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRespository: Repository<UserEntity>,
  ) {}
  async validateUser(loginDto: LoginDto): Promise<UserEntity> {
    const user = await this.userRespository.findOne({
      where: { userName: loginDto.userName },
    });
    if (!user || !(await bcrypt.compare(loginDto.passWord, user.passWord))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }
}
