import { Flight } from 'src/flights/entities/flight.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { BookingDetail } from 'src/booking-details/entities/booking-detail.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  booking_date: Date; // Thời gian tạo đơn đặt vé

  @UpdateDateColumn()
  updated_at: Date; // Thời gian cập nhật trạng thái đặt vé

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_price: number; // Tổng giá trị của đơn đặt vé

  @Column({
    type: 'enum',
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'refunded'],
    default: 'pending',
  })
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'refunded';

  @ManyToOne(() => UserEntity, (user) => user.bookings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  @Index()
  user: UserEntity; // Người dùng đặt vé

  @ManyToOne(() => Flight, (flight) => flight.bookings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'flight_id' })
  @Index()
  flight: Flight; // Chuyến bay được đặt vé

  @OneToMany(() => BookingDetail, (bookingDetail) => bookingDetail.booking, {
    cascade: true,
  })
  bookingDetails: BookingDetail[]; // Chi tiết đặt vé
}
