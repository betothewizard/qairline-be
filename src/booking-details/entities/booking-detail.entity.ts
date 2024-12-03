import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { Booking } from 'src/bookings/entities/booking.entity';
import { Passenger } from 'src/passengers/entities/passenger.entity';
import { Seat } from 'src/seats/entities/seat.entity';
import { Flight } from 'src/flights/entities/flight.entity';

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

  @ManyToOne(() => Flight, (flight) => flight.bookingDetails)
  @JoinColumn({ name: 'flight_id' })
  flight: Flight;

  @Column({ unique: true })
  seat_number: string;
  // Số ghế (ví dụ: 12A, 1B)

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number; // Giá vé cho ghế này (nếu có chênh lệch giữa các ghế)

  @Column({
    type: 'enum',
    enum: ['booked', 'cancelled', 'checked_in'],
    default: 'booked',
  })
  status: 'booked' | 'cancelled' | 'checked_in'; // Trạng thái ghế (đã đặt, đã hủy, đã check-in)
}
