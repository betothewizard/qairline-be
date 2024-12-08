import { Airplane } from 'src/airplanes/entities/airplane.entity';
import { Seat } from 'src/seats/entities/seat.entity';
import { Booking } from 'src/bookings/entities/booking.entity';
import { Promotion } from 'src/promotions/entities/promotion.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
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

  @ManyToMany(() => Promotion, (promotion) => promotion.flights)
  promotions: Promotion[]; // Quan hệ với bảng Promotion

  @OneToMany(() => Seat, (seat) => seat.flight, { cascade: true })
  seats: Seat[];

  @OneToMany(() => Booking, (booking) => booking.flight)
  bookings: Booking[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
