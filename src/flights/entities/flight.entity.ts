import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('flights')
export class Flight {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  flight_code: string;

  @Column()
  airline: string;

  @Column()
  origin: string;

  @Column()
  destination: string;

  @Column('timestamp')
  departure_time: Date;

  @Column('timestamp')
  arrival_time: Date;

  @Column({
    type: 'enum',
    enum: ['scheduled', 'delayed', 'canceled', 'completed'],
    default: 'scheduled',
  })
  status: 'scheduled' | 'delayed' | 'canceled' | 'completed';

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
