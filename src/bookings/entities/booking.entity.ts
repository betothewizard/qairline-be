import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BookingDetail } from 'src/booking-details/entities/booking-detail.entity';
import { Flight } from 'src/flights/entities/flight.entity';
import { UserEntity } from 'src/users/entities/user.entity';
@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string; // Khóa chính

  @Column({ type: 'varchar', length: 50, nullable: true })
  booking_code: string; // Mã đặt chỗ (tự sinh hoặc theo định dạng như Vietjet)

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_price: number; // Tổng giá trị đặt chỗ (bao gồm tất cả hành khách và dịch vụ)

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
  flight: Flight;

  @OneToMany(() => BookingDetail, (bookingDetail) => bookingDetail.booking, {
    cascade: true,
  })
  bookingDetails: BookingDetail[]; // Liên kết đến bảng BookingDetail

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date; // Ngày giờ tạo

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date; // Ngày giờ cập nhật
}
