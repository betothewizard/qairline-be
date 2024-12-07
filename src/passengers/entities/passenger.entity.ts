import { BookingDetail } from 'src/booking-details/entities/booking-detail.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('passengers') // Tên bảng trong cơ sở dữ liệu
export class Passenger {
  @PrimaryGeneratedColumn('uuid')
  id: string; // ID duy nhất cho hành khách

  @Column({ type: 'enum', enum: ['adult', 'child'], default: 'adult' })
  type: 'adult' | 'child'; // Loại hành khách: người lớn hoặc trẻ em

  @Column({ type: 'enum', enum: ['male', 'female', 'other'], default: 'male' })
  gender: 'male' | 'female' | 'other'; // Giới tính

  @Column({ length: 50 })
  firstName: string; // Họ

  @Column({ length: 50 })
  lastName: string; // Tên đệm và tên

  @Column({ type: 'date' })
  dateOfBirth: Date; // Ngày sinh

  @Column({ length: 50, default: 'Vietnam' })
  nationality: string; // Quốc gia

  @Column({ length: 20, nullable: true })
  phoneNumber: string; // Số điện thoại (có thể null)

  @Column({ length: 100, nullable: true })
  email: string; // Email (có thể null)

  @Column({ length: 50, nullable: true })
  idCardOrPassport: string; // CCCD hoặc Passport

  @Column({ type: 'text', nullable: true })
  currentAddress: string; // Nơi ở hiện tại

  @OneToMany(() => BookingDetail, (bookingDetail) => bookingDetail.passenger)
  bookingDetails: BookingDetail[];

  @CreateDateColumn()
  createdAt: Date; // Thời gian tạo

  @UpdateDateColumn()
  updatedAt: Date; // Thời gian cập nhật
}
