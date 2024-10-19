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
  constructor(private readonly notesService: UsersService) {}

  @Get()
  async getAll(): Promise<UserEntity[]> {
    return this.notesService.findAll();
  }

  @Post()
  async create(
    @Body(new ValidationPipe()) notesDto: UsersDto,
  ): Promise<UserEntity> {
    return this.notesService.create(notesDto);
  }

  @Get('/:id')
  async findOne(@Param('id') id: number): Promise<UserEntity> {
    return this.notesService.findOne(id);
  }

  @Put('/:id')
  async update(
    @Param('id') id: number,
    @Body() notesDto: UsersDto,
  ): Promise<UserEntity> {
    return this.notesService.update(id, notesDto);
  }

  @Delete('/:id')
  async delete(@Param('id') id: number): Promise<boolean> {
    return this.notesService.delete(id);
  }
}
