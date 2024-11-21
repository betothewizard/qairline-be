import { Controller, Post, Body, Delete, Param } from '@nestjs/common';
import { BookingService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingService.create(createBookingDto);
  }
  @Delete(':id')
  async cancelBooking(@Param('id') id: string) {
    return await this.bookingService.cancelBooking(id);
  }
  @Delete(':bookingId/seats')
  async cancelSeatsInBooking(
    @Param('bookingId') bookingId: string,
    @Body('seatIds') seatIds: string[],
  ) {
    return this.bookingService.cancelSeatsInBooking(bookingId, seatIds);
  }
}
