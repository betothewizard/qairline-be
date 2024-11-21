import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('airplanes')
export class Airplane {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  model: string;

  @Column({ type: 'varchar', length: 100 })
  manufacturer: string;

  @Column({ type: 'int' })
  seat_capacity: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  airplane_type: string;

  @Column({ type: 'varchar', length: 50, default: 'available' })
  status: string;

  @Column({ type: 'int', nullable: true })
  year_of_make: number;

  @Column({ type: 'timestamp', nullable: true })
  last_service_at?: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
