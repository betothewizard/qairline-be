import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingController } from './bookings.controller';
import { BookingService } from './bookings.service';
import { Booking } from 'src/bookings/entities/booking.entity';
import { Flight } from 'src/flights/entities/flight.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { Passenger } from 'src/passengers/entities/passenger.entity';
import { BookingDetail } from 'src/booking-details/entities/booking-detail.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Booking,
      Flight,
      UserEntity,
      Passenger,
      BookingDetail,
    ]),
  ],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService],
})
export class BookingModule {}
