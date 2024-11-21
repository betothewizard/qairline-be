// booking-seat.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingSeat } from './entities/booking-seat.entity';
import { Seat } from '../seats/entities/seat.entity'; // Seat entity
import { Booking } from '../bookings/entities/booking.entity'; // Booking entity
import { CreateBookingSeatDto } from './dto/create-booking-seat.dto';

@Injectable()
export class BookingSeatService {
  constructor(
    @InjectRepository(BookingSeat)
    private readonly bookingSeatRepository: Repository<BookingSeat>,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>, // Inject Repository for Booking
    @InjectRepository(Seat)
    private readonly seatRepository: Repository<Seat>, // Inject Repository for Seat
  ) {}

  async create(
    createBookingSeatDto: CreateBookingSeatDto,
  ): Promise<BookingSeat> {
    // Ánh xạ DTO thành thực thể BookingSeat
    const bookingSeat = this.bookingSeatRepository.create({
      booking: { id: createBookingSeatDto.booking_id }, // Liên kết với Booking
      seat: { id: createBookingSeatDto.seat_id }, // Liên kết với Seat
    });

    // Lưu vào database
    return await this.bookingSeatRepository.save(bookingSeat);
  }

  async findAll() {
    return this.bookingSeatRepository.find({ relations: ['booking', 'seat'] });
  }

  async findOne(id: string) {
    return this.bookingSeatRepository.findOne({
      where: { id },
      relations: ['booking', 'seat'],
    });
  }

  async remove(id: string) {
    return this.bookingSeatRepository.delete(id);
  }
}
