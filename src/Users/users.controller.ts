import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService as UsersService } from './users.service';
import { UsersDto } from './dto/user.dto';
import { UserEntity } from './entities/user.entity';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAll(): Promise<UserEntity[]> {
    return this.usersService.findAll();
  }

  @Post()
  async create(
    @Body(new ValidationPipe()) notesDto: UsersDto,
  ): Promise<UserEntity> {
    return this.usersService.create(notesDto);
  }

  @Get('/:id')
  async findOne(@Param('id') id: number): Promise<UserEntity> {
    return this.usersService.findOne(id);
  }

  @Put('/:id')
  async update(
    @Param('id') id: number,
    @Body() notesDto: UsersDto,
  ): Promise<UserEntity> {
    return this.usersService.update(id, notesDto);
  }

  @Delete('/:id')
  async delete(@Param('id') id: number): Promise<boolean> {
    return this.usersService.delete(id);
  }
}
