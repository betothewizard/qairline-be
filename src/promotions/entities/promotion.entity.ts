import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Flight } from 'src/flights/entities/flight.entity';

@Entity('promotions')
export class Promotion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discountValue: number;

  @Column({ length: 50, unique: true, nullable: true }) // Mã khuyến mãi, unique đảm bảo không trùng lặp
  promotionCode: string;

  @Column('timestamp')
  startDate: Date;

  @Column('timestamp')
  endDate: Date;

  @Column({ nullable: true })
  image: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Thêm quan hệ nhiều-nhiều với bảng Flight
  @ManyToMany(() => Flight, (flight) => flight.promotions)
  @JoinTable()
  flights: Flight[];
}
