// bookings/bookings.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { Booking } from './entities/booking.entity';
import { BookingDetail } from 'src/booking-details/entities/booking-detail.entity';
import { Passenger } from 'src/passengers/entities/passenger.entity';
import { Seat } from 'src/seats/entities/seat.entity';
import { Flight } from 'src/flights/entities/flight.entity';
import { UserEntity } from 'src/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Booking,
      BookingDetail,
      Passenger,
      Seat,
      Flight,
      UserEntity,
    ]),
  ],
  providers: [BookingsService],
  controllers: [BookingsController],
})
export class BookingsModule {}
