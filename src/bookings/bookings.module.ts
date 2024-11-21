import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingController } from './bookings.controller';
import { BookingService } from './bookings.service';
import { Booking } from 'src/bookings/entities/booking.entity';
import { Seat } from 'src/seats/entities/seat.entity';
import { BookingSeat } from 'src/booking-seats/entities/booking-seat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, Seat, BookingSeat])],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
