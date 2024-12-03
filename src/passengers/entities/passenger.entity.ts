import { BookingDetail } from 'src/booking-details/entities/booking-detail.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum PassengerType {
  ADULT = 'adult',
  CHILD = 'child',
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

@Entity('passengers')
export class Passenger {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  name: string; // Tên hành khách

  @Column({
    type: 'enum',
    enum: Gender,
  })
  gender: Gender; // Giới tính

  @Column({
    type: 'date',
    nullable: true,
  })
  date_of_birth: Date | null; // Ngày sinh

  @Column({
    type: 'enum',
    enum: PassengerType,
    default: PassengerType.ADULT,
  })
  type: PassengerType; // Loại hành khách: Người lớn/Trẻ em

  @Index()
  @Column({
    type: 'varchar',
    length: 12,
    unique: true,
    nullable: true,
  })
  citizen_id: string | null; // Số căn cước công dân

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => BookingDetail, (bookingDetail) => bookingDetail.passenger)
  bookingDetails: BookingDetail[];
}
