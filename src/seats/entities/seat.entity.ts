import { Flight } from 'src/flights/entities/flight.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('seats')
export class Seat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  seat_number: string;

  @Column({
    type: 'enum',
    enum: ['economy', 'business', 'first'],
  })
  class: 'economy' | 'business' | 'first';

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ default: false })
  is_booked: boolean;

  @ManyToOne(() => Flight, (flight) => flight.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'flight_id' })
  flight: Flight;
}
