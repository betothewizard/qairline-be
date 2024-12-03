import { Airplane } from 'src/airplanes/entities/airplane.entity';
import { Seat } from 'src/seats/entities/seat.entity';
import { BookingDetail } from 'src/booking-details/entities/booking-detail.entity';
import { Booking } from 'src/bookings/entities/booking.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';

@Entity('flights')
export class Flight {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @Index()
  flight_code: string;

  @Column()
  airline: string;

  @Column()
  origin: string; //nơi xuất phát

  @Column()
  destination: string; //Nơi đến

  @ManyToOne(() => Airplane)
  @JoinColumn({ name: 'airplane_id' })
  airplane: Airplane;

  @Column('timestamp')
  departure_time: Date; //Thời gian khởi hành

  @Column('timestamp')
  arrival_time: Date; //Thời gian hạ cánh

  @Column({ type: 'int', nullable: false })
  total_seats: number;

  @Column({
    type: 'enum',
    enum: ['scheduled', 'delayed', 'canceled', 'completed'],
    default: 'scheduled',
  })
  status: 'scheduled' | 'delayed' | 'canceled' | 'completed';

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @OneToMany(() => Seat, (seat) => seat.flight, { cascade: true })
  seats: Seat[];
  @OneToMany(() => BookingDetail, (bookingDetail) => bookingDetail.flight)
  bookingDetails: BookingDetail[];
  @OneToMany(() => Booking, (booking) => booking.flight)
  bookings: Booking[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
