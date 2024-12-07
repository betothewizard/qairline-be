import {
  Controller,
  Post,
  Get,
  Param,
  Patch,
  Delete,
  Body,
} from '@nestjs/common';
import { SeatService } from './seats.service';
import { CreateSeatDto } from './dto/create-seat.dto';
import { Seat } from './entities/seat.entity';

@Controller('seats')
export class SeatController {
  constructor(private readonly seatService: SeatService) {}

  @Post()
  create(@Body() createSeatDto: CreateSeatDto) {
    return this.seatService.create(createSeatDto);
  }

  // seats/seats.controller.ts
  @Post(':seatNumber/select/:flightId')
  async selectSeat(
    @Param('seatNumber') seatNumber: string,
    @Param('flightId') flightId: string,
  ): Promise<Seat> {
    return await this.seatService.selectSeat(seatNumber, flightId);
  }

  @Get()
  findAll() {
    return this.seatService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.seatService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateData: Partial<CreateSeatDto>) {
    return this.seatService.update(id, updateData);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.seatService.remove(id);
  }
}
