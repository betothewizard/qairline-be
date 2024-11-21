import { Flight } from 'src/flights/entities/flight.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('seats')
export class Seat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  seat_number: string;

  @Column({ type: 'boolean', default: false })
  isBooked: boolean;

  @Column({
    type: 'enum',
    enum: ['economy', 'business', 'first'],
  })
  class: 'economy' | 'business' | 'first';

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @ManyToOne(() => Flight, (flight) => flight.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'flight_id' })
  flight: Flight;
}
