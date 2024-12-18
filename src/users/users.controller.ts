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
import { UserService as UsersService } from './users.service';
import { UsersDto } from './dto/user.dto';
import { UserEntity } from './entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/Enum/role.enum';

@Controller('user')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('protected')
  getProtectedResource() {
    return { message: 'Đây là tài nguyên được bảo vệ' };
  }

  @Get()
  async getAll(): Promise<UserEntity[]> {
    return this.userService.findAll();
  }

  @Post('create')
  @UseGuards(JwtAuthGuard, RolesGuard) // Sử dụng cả hai Guards
  @Roles(Role.Admin)
  async create(
    @Body(new ValidationPipe()) usersDto: UsersDto,
  ): Promise<UserEntity> {
    return this.userService.create(usersDto);
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string): Promise<UserEntity> {
    return this.userService.findOne(id);
  }

  @Put('/:id')
  async update(
    @Param('id') id: string,
    @Body() usersDto: UsersDto,
  ): Promise<UserEntity> {
    return this.userService.update(id, usersDto);
  }

  @Delete('/:id')
  async delete(@Param('id') id: string): Promise<boolean> {
    return this.userService.delete(id);
  }
}
