import { Airplane } from 'src/airplanes/entities/airplane.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
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
