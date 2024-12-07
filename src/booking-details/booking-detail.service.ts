import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBookingDetailDto } from './dto/create-booking-detail.dto';
import { BookingDetail } from './entities/booking-detail.entity';
import { Booking } from 'src/bookings/entities/booking.entity';
import { Passenger } from 'src/passengers/entities/passenger.entity';
import { Seat } from 'src/seats/entities/seat.entity';

@Injectable()
export class BookingDetailsService {
  constructor(
    @InjectRepository(BookingDetail)
    private readonly bookingDetailsRepository: Repository<BookingDetail>,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(Passenger)
    private readonly passengerRepository: Repository<Passenger>,
    @InjectRepository(Seat)
    private readonly seatRepository: Repository<Seat>,
  ) {}

  // Tạo mới booking detail
  async create(
    createBookingDetailDto: CreateBookingDetailDto,
  ): Promise<BookingDetail> {
    // Lấy các entity liên quan từ DTO
    const booking = await this.bookingRepository.findOne({
      where: { id: createBookingDetailDto.booking_id },
    });
    const passenger = await this.passengerRepository.findOne({
      where: { id: createBookingDetailDto.passenger_id },
    });
    const seat = await this.seatRepository.findOne({
      where: { id: createBookingDetailDto.seat_id },
    });

    if (!booking || !passenger || !seat) {
      throw new Error('Invalid booking, passenger, seat, or flight ID');
    }

    // Tạo đối tượng BookingDetail từ các entity đã lấy
    const bookingDetail = this.bookingDetailsRepository.create({
      booking,
      passenger,
      seat,
    });

    // Lưu entity BookingDetail vào cơ sở dữ liệu
    return this.bookingDetailsRepository.save(bookingDetail);
  }

  // Tìm tất cả booking details
  async findAll(): Promise<BookingDetail[]> {
    return this.bookingDetailsRepository.find();
  }

  // Tìm booking detail theo ID
  async findOne(id: string): Promise<BookingDetail> {
    return this.bookingDetailsRepository.findOne({ where: { id } });
  }

  // Xóa booking detail theo ID
  async remove(id: string): Promise<void> {
    await this.bookingDetailsRepository.delete(id);
  }
}
