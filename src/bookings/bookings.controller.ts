import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Get,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Booking } from './entities/booking.entity';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  async create(@Body() createBookingDto: CreateBookingDto): Promise<Booking> {
    try {
      return await this.bookingsService.createBooking(createBookingDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('calculate-price')
  async calculatePrice(
    @Body('ticketCount') ticketCount: number,
    @Body('seatClass') seatClass: string,
    @Body('flightId') flightId: string,
  ): Promise<{ totalPrice: number }> {
    try {
      // Gọi service để tính tổng giá
      const totalPrice = await this.bookingsService.calculateTotalPrice(
        ticketCount,
        seatClass,
        flightId,
      );

      // Trả về kết quả
      return { totalPrice };
    } catch (error) {
      // Xử lý lỗi và trả về thông báo lỗi
      throw new Error(error.message || 'Error calculating total price');
    }
  }
}
