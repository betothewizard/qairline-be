import { Flight } from 'src/flights/entities/flight.entity';
import { BookingDetail } from 'src/booking-details/entities/booking-detail.entity';
import {
  Column,
  Entity,
  OneToMany,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('seats')
export class Seat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  seat_number: string;

  @Column({
    type: 'enum',
    enum: ['Business', 'SkyBoss', 'Deluxe', 'Eco'],
    default: 'Eco',
  })
  ticket_class: 'Business' | 'SkyBoss' | 'Deluxe' | 'Eco'; // Hạng vé

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;

  @Column({ default: false })
  isBooked: boolean;

  @ManyToOne(() => Flight, (flight) => flight.seats, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'flight_id' })
  flight: Flight;

  @OneToMany(() => BookingDetail, (bookingDetail) => bookingDetail.seat)
  bookingDetails: BookingDetail[]; // Quan hệ ngược
}
