import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingDetailsService } from './booking-detail.service';
import { BookingDetailsController } from './booking-detail.controller';
import { BookingDetail } from './entities/booking-detail.entity';
import { Booking } from 'src/bookings/entities/booking.entity';
//import { UserEntity } from 'src/users/entities/user.entity';
import { Seat } from 'src/seats/entities/seat.entity';
import { UsersModule } from 'src/users/users.module';
import { Passenger } from 'src/passengers/entities/passenger.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([BookingDetail, Booking, Passenger, Seat]),
    UsersModule,
  ],
  controllers: [BookingDetailsController],
  providers: [BookingDetailsService],
})
export class BookingDetailsModule {}
