// passengers/passengers.controller.ts
import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { PassengersService } from './passengers.service';
import { CreatePassengerDto } from './dto/create-passenger.dto';
import { Passenger } from './entities/passenger.entity';

@Controller('passengers')
export class PassengersController {
  constructor(private readonly passengersService: PassengersService) {}

  // Tạo hành khách mới
  @Post()
  async create(
    @Body() createPassengerDtos: CreatePassengerDto[],
  ): Promise<string[]> {
    const passengers =
      await this.passengersService.createMany(createPassengerDtos);

    // Trả về danh sách ID theo đúng thứ tự
    return passengers.map((p) => p.id);
  }

  // Lấy tất cả hành khách
  @Get()
  async findAll(): Promise<Passenger[]> {
    return this.passengersService.findAll();
  }

  // Lấy hành khách theo id
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Passenger> {
    return this.passengersService.findOne(id);
  }
}
