import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Booking } from './entities/booking.entity';
import { BookingDetail } from 'src/booking-details/entities/booking-detail.entity';
import { Flight } from 'src/flights/entities/flight.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { Seat } from 'src/seats/entities/seat.entity';

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

  async calculateTotalPrice(
    ticketCount: number,
    seatClass: string,
    flightId: string,
  ): Promise<number> {
    // Lấy giá của ghế tương ứng với seatClass và flightId
    const flight = await this.flightRepository.findOne({
      where: { id: flightId },
      relations: ['seats'], // Giả sử flight có nhiều ghế
    });

    if (!flight) {
      throw new Error('Flight not found');
    }

    const seat = flight.seats.find((seat) => seat.ticket_class === seatClass); // Tìm ghế theo loại
    if (!seat) {
      throw new Error('Seat class not found');
    }
    console.log(seat.price + ' ' + seat.ticket_class + ' ' + seat.id);
    // Tính tổng giá
    const totalPrice = Number(seat.price) * ticketCount; // Giá ghế x số lượng vé
    return totalPrice;
  }
}
