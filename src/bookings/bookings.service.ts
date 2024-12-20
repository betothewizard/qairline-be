import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Booking } from './entities/booking.entity';
import { BookingDetail } from 'src/booking-details/entities/booking-detail.entity';
import { Flight } from 'src/flights/entities/flight.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { Seat } from 'src/seats/entities/seat.entity';
import { CalculatePriceDto } from './dto/calculate-price.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(Flight)
    private flightRepository: Repository<Flight>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(BookingDetail)
    private bookingDetailRepository: Repository<BookingDetail>,
    @InjectRepository(Seat)
    private seatRepository: Repository<Seat>,
  ) {}

  async createBooking(createBookingDto: CreateBookingDto): Promise<Booking> {
    // Lấy thông tin người dùng và chuyến bay từ database
    const user = await this.userRepository.findOneBy({
      id: createBookingDto.user_id,
    });
    if (!user) {
      throw new Error('User not found');
    }

    const flight = await this.flightRepository.findOneBy({
      id: createBookingDto.flight_id,
    });
    if (!flight) {
      throw new Error('Flight not found');
    }

    // Tạo booking mới
    const booking = this.bookingRepository.create({
      booking_code: createBookingDto.booking_code,
      total_price: createBookingDto.total_price,
      status: createBookingDto.status || 'pending',
      user: user,
      flight: flight,
    });

    // Lưu booking vào database
    const savedBooking = await this.bookingRepository.save(booking);

    // Xử lý booking details
    for (const detail of createBookingDto.bookingDetails) {
      const bookingDetail = this.bookingDetailRepository.create({
        booking: savedBooking,
        passenger: { id: detail.passenger_id }, // Gán đối tượng passenger
        seat: { id: detail.seat_id }, // Gán đối tượng seat
      });

      // Lưu từng booking detail vào database
      await this.bookingDetailRepository.save(bookingDetail);
    }

    return savedBooking;
  }

  async getBookings(): Promise<
    {
      bookingCode: string;
      fullName: string;
      flightCode: string;
      origin: string;
      destination: string;
      totalPrice: number;
      status: string;
    }[]
  > {
    const bookings = await this.bookingRepository.find({
      relations: ['user', 'flight'], // Đảm bảo load quan hệ liên quan
    });

    return bookings.map((booking) => ({
      bookingCode: booking.booking_code,
      fullName: booking.user?.fullName || 'Unknown', // Tránh lỗi khi user null
      flightCode: booking.flight?.flight_code || 'Unknown', // Tránh lỗi khi flight null
      origin: booking.flight?.origin || 'Unknown',
      destination: booking.flight?.destination || 'Unknown',
      totalPrice: booking.total_price,
      status: booking.status,
    }));
  }
  async calculateTotalPrice(dto: CalculatePriceDto): Promise<number> {
    const { ticketCount, seatClass, flightId, discount, discountType } = dto;

    // Lấy thông tin chuyến bay và ghế
    const flight = await this.flightRepository.findOne({
      where: { id: flightId },
      relations: ['seats'], // Đảm bảo load các ghế liên quan
    });

    if (!flight) {
      throw new Error('Flight not found'); // Không tìm thấy chuyến bay
    }

    // Tìm ghế theo loại ghế (seatClass)
    const seat = flight.seats.find((seat) => seat.ticket_class === seatClass);
    if (!seat) {
      throw new Error('Seat class not found'); // Không tìm thấy loại ghế
    }

    // Tính giá vé ban đầu (trước khi giảm giá)
    let totalPrice = Number(seat.price) * ticketCount;

    // Áp dụng giảm giá nếu có
    if (discount && discount > 0) {
      if (discountType === 'percentage') {
        // Giảm giá theo phần trăm
        totalPrice *= 1 - discount / 100;
      } else if (discountType === 'fixed') {
        // Giảm giá cố định
        totalPrice -= discount;
      }
    }

    // Đảm bảo tổng giá không âm
    if (totalPrice < 0) {
      throw new Error('Total price cannot be negative.');
    }

    return totalPrice;
  }
}
