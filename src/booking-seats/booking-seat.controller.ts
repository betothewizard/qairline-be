import { Controller, Post, Get, Param, Delete, Body } from '@nestjs/common';
import { BookingSeatService } from './booking-seat.service';
import { CreateBookingSeatDto } from './dto/create-booking-seat.dto';

@Controller('booking-seats')
export class BookingSeatController {
  constructor(private readonly bookingSeatService: BookingSeatService) {}

  @Post()
  create(@Body() createBookingSeatDto: CreateBookingSeatDto) {
    return this.bookingSeatService.create(createBookingSeatDto);
  }

  @Get()
  findAll() {
    return this.bookingSeatService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingSeatService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookingSeatService.remove(id);
  }
}
