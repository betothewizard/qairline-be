import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Flight } from 'src/flights/entities/flight.entity';
import { UserEntity } from 'src/users/entities/user.entity';

import { BookingDetail } from 'src/booking-details/entities/booking-detail.entity';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(Flight)
    private flightRepository: Repository<Flight>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(BookingDetail)
    private bookingDetailRepository: Repository<BookingDetail>,
  ) {}

  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    const { flightId, userId, bookingDetails, totalPrice } = createBookingDto;

    // Kiểm tra Flight và User
    const flight = await this.flightRepository.findOne({
      where: { id: flightId },
    });
    if (!flight) {
      throw new NotFoundException(`Flight with ID ${flightId} not found`);
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Tạo Booking
    const booking = this.bookingRepository.create({
      flight,
      user,
      total_price: totalPrice,
    });

    await this.bookingRepository.save(booking);

    // Lưu BookingDetails
    for (const detail of bookingDetails) {
      const bookingDetail = this.bookingDetailRepository.create({
        booking,
        seat_number: detail.seatNumber,
        passenger: detail.passenger, // Đây là quan hệ với bảng Passenger
      });
      await this.bookingDetailRepository.save(bookingDetail);
    }

    return this.bookingRepository.findOne({
      where: { id: booking.id },
      relations: [
        'user',
        'flight',
        'bookingDetails',
        'bookingDetails.passenger',
      ],
    });
  }

  async findAll(): Promise<Booking[]> {
    return this.bookingRepository.find({
      relations: ['user', 'flight', 'bookingDetails'],
    });
  }

  async findOne(id: string): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['user', 'flight', 'bookingDetails'],
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    return booking;
  }

  async update(
    id: string,
    updateBookingDto: UpdateBookingDto,
  ): Promise<Booking> {
    const booking = await this.findOne(id);
    Object.assign(booking, updateBookingDto);

    return this.bookingRepository.save(booking);
  }

  async remove(id: string): Promise<void> {
    const booking = await this.findOne(id);
    await this.bookingRepository.remove(booking);
  }
}
