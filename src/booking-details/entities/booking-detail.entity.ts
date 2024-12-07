import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Booking } from 'src/bookings/entities/booking.entity';
import { Passenger } from 'src/passengers/entities/passenger.entity';
import { Seat } from 'src/seats/entities/seat.entity';

@Entity('booking_details')
export class BookingDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Booking, (booking) => booking.bookingDetails, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'booking_id' })
  booking: Booking;

  @ManyToOne(() => Passenger, (passenger) => passenger.bookingDetails, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'passenger_id' })
  passenger: Passenger;

  @ManyToOne(() => Seat, (seat) => seat.bookingDetails, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'seat_id' })
  seat: Seat;
}
