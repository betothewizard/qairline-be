// booking-seat.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingSeatService } from './booking-seat.service';
import { BookingSeat } from './entities/booking-seat.entity';
import { Seat } from '../seats/entities/seat.entity'; // Seat entity
import { Booking } from '../bookings/entities/booking.entity'; // Booking entity
import { BookingSeatController } from './booking-seat.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookingSeat, Seat, Booking]), // Đảm bảo tất cả các entity cần thiết đã được khai báo
  ],
  controllers: [BookingSeatController],
  providers: [BookingSeatService],
  exports: [TypeOrmModule],
})
export class BookingSeatModule {}
