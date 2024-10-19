import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/Users/entities/user.entity';
import { Repository } from 'typeorm';
import { UsersDto } from 'src/Users/dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}
  async create(userDto: UsersDto): Promise<UserEntity> {
    const salt = await bcrypt.genSalt();
    userDto.passWord = await bcrypt.hash(userDto.passWord, salt);

    const user = this.userRepository.create(userDto);
    return this.userRepository.save(user);
  }

  async findAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<UserEntity> {
    return this.userRepository.findOneBy({ id });
  }

  async update(id: number, notesDto: UsersDto): Promise<UserEntity> {
    await this.userRepository.update(id, notesDto);
    return this.findOne(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.userRepository.delete(id);
    return result.affected > 0;
  }
}
