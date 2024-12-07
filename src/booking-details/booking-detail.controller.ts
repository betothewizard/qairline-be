import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { BookingDetailsService } from './booking-detail.service';
import { CreateBookingDetailDto } from './dto/create-booking-detail.dto';
import { BookingDetail } from './entities/booking-detail.entity';

@Controller('booking-details')
export class BookingDetailsController {
  constructor(private readonly bookingDetailsService: BookingDetailsService) {}

  // Tạo mới booking detail
  @Post()
  async create(
    @Body() createBookingDetailDto: CreateBookingDetailDto,
  ): Promise<BookingDetail> {
    return this.bookingDetailsService.create(createBookingDetailDto);
  }

  // Lấy tất cả booking details
  @Get()
  async findAll(): Promise<BookingDetail[]> {
    return this.bookingDetailsService.findAll();
  }

  // Lấy booking detail theo ID
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<BookingDetail> {
    return this.bookingDetailsService.findOne(id);
  }

  // Xóa booking detail theo ID
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.bookingDetailsService.remove(id);
  }
}
