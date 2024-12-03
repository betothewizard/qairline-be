// src/booking-details/booking-detail.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingDetail } from './entities/booking-detail.entity';
import { CreateBookingDetailDto } from './dto/create-booking-detail.dto';

@Injectable()
export class BookingDetailService {
  constructor(
    @InjectRepository(BookingDetail)
    private bookingDetailRepository: Repository<BookingDetail>,
  ) {}

  async create(
    createBookingDetailDto: CreateBookingDetailDto,
  ): Promise<BookingDetail> {
    const bookingDetail = this.bookingDetailRepository.create(
      createBookingDetailDto,
    );
    return await this.bookingDetailRepository.save(bookingDetail);
  }

  async findAll(): Promise<BookingDetail[]> {
    return await this.bookingDetailRepository.find();
  }

  async findOne(id: string): Promise<BookingDetail> {
    return await this.bookingDetailRepository.findOne({ where: { id } });
  }

  async remove(id: string): Promise<void> {
    await this.bookingDetailRepository.delete(id);
  }
}
