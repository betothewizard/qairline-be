import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { BookingSeat } from 'src/booking-seats/entities/booking-seat.entity';
import { Seat } from 'src/seats/entities/seat.entity';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(BookingSeat)
    private readonly bookingSeatRepository: Repository<BookingSeat>,
    @InjectRepository(Seat)
    private readonly seatRepository: Repository<Seat>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createBookingDto: CreateBookingDto) {
    const { user_id, flight_id, seat_ids } = createBookingDto;

    return await this.dataSource.transaction(async (manager) => {
      // Kiểm tra ghế
      const seats = await manager.find(Seat, {
        where: { id: In(seat_ids), isBooked: false },
      });

      if (seats.length !== seat_ids.length) {
        throw new BadRequestException('Một hoặc nhiều ghế không tồn tại.');
      }

      // Cập nhật trạng thái ghế
      await manager.update(Seat, { id: In(seat_ids) }, { isBooked: true });

      // Tính tổng tiền
      const totalPrice = seats.reduce((sum, seat) => {
        const price = Number(seat.price);
        if (isNaN(price)) {
          throw new BadRequestException(
            `Giá không hợp lệ cho ghế ID ${seat.id}`,
          );
        }
        return sum + parseFloat(price.toFixed(2));
      }, 0);

      // Tạo booking
      const booking = manager.create(Booking, {
        user: { id: user_id },
        flight: { id: flight_id },
        total_price: totalPrice,
      });
      const savedBooking = await manager.save(Booking, booking);

      // Tạo liên kết BookingSeat
      const bookingSeats = seat_ids.map((seat_id) => ({
        booking: savedBooking,
        seat: { id: seat_id },
      }));
      await manager.insert(BookingSeat, bookingSeats);

      return savedBooking;
    });
  }

  async cancelBooking(bookingId: string) {
    // Lấy thông tin ghế từ booking
    const bookingSeats = await this.bookingSeatRepository.find({
      where: { booking: { id: bookingId } },
      relations: ['seat'],
    });

    // Cập nhật trạng thái ghế về chưa đặt
    const seatIds = bookingSeats.map((bs) => bs.seat.id);
    await this.seatRepository.update({ id: In(seatIds) }, { isBooked: false });

    // Xóa các bản ghi liên quan
    await this.bookingSeatRepository.delete({ booking: { id: bookingId } });
    await this.bookingRepository.delete(bookingId);

    return { message: 'Booking canceled successfully.' };
  }

  async cancelSeatsInBooking(bookingId: string, seatIds: string[]) {
    // Lấy tất cả ghế thuộc booking
    const bookingSeats = await this.bookingSeatRepository.find({
      where: { booking: { id: bookingId }, seat: { id: In(seatIds) } },
      relations: ['seat'],
    });

    if (bookingSeats.length !== seatIds.length) {
      throw new BadRequestException(
        'Một hoặc nhiều ghế không tồn tại trong booking này.',
      );
    }

    // Cập nhật trạng thái ghế về chưa đặt
    const seatIdsToCancel = bookingSeats.map((bs) => bs.seat.id);
    await this.seatRepository.update(
      { id: In(seatIdsToCancel) },
      { isBooked: false },
    );

    // Xóa các bản ghi trong bảng booking_seat
    await this.bookingSeatRepository.delete({
      booking: { id: bookingId },
      seat: { id: In(seatIdsToCancel) },
    });

    return {
      message: `Seats ${seatIdsToCancel.join(', ')} have been canceled from booking ${bookingId}.`,
    };
  }
}
