import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { UsersService as UsersService } from './users.service';
import { UsersDto } from './dto/user.dto';
import { UserEntity } from './entities/user.entity';
import { JwtAuthGuard } from 'src/Auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/Auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/Enum/role.enum';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('protected')
  getProtectedResource() {
    return { message: 'Đây là tài nguyên được bảo vệ' };
  }

  @Get()
  async getAll(): Promise<UserEntity[]> {
    return this.usersService.findAll();
  }

  @Post('create')
  @UseGuards(JwtAuthGuard, RolesGuard) // Sử dụng cả hai Guards
  @Roles(Role.Admin)
  async create(
    @Body(new ValidationPipe()) usersDto: UsersDto,
  ): Promise<UserEntity> {
    return this.usersService.create(usersDto);
  }

  @Get('/:id')
  async findOne(@Param('id') id: number): Promise<UserEntity> {
    return this.usersService.findOne(id);
  }

  @Put('/:id')
  async update(
    @Param('id') id: number,
    @Body() usersDto: UsersDto,
  ): Promise<UserEntity> {
    return this.usersService.update(id, usersDto);
  }

  @Delete('/:id')
  async delete(@Param('id') id: number): Promise<boolean> {
    return this.usersService.delete(id);
  }
}
