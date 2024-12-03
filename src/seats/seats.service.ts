import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seat } from './entities/seat.entity';
import { CreateSeatDto } from './dto/create-seat.dto';
import { Flight } from 'src/flights/entities/flight.entity';

@Injectable()
export class SeatService {
  constructor(
    @InjectRepository(Seat)
    private readonly seatRepository: Repository<Seat>,
    @InjectRepository(Flight)
    private readonly flightRepository: Repository<Flight>,
  ) {}

  async create(createSeatDto: CreateSeatDto): Promise<Seat> {
    // Tìm chuyến bay theo flight_id
    const flight = await this.flightRepository.findOne({
      where: { id: createSeatDto.flight_id },
    });

    if (!flight) {
      throw new Error('Flight not found');
    }

    // Kiểm tra nếu ghế đã tồn tại trên chuyến bay này
    const existingSeat = await this.seatRepository.findOne({
      where: {
        seat_number: createSeatDto.seat_number,
        flight: { id: createSeatDto.flight_id }, // Kiểm tra chuyến bay
      },
    });

    if (existingSeat) {
      // Kiểm tra trạng thái ghế
      if (existingSeat.isBooked) {
        throw new Error('Seat is already booked');
      }
      // Nếu ghế tồn tại và chưa được đặt, có thể không cần tạo mới hoặc xử lý tiếp
      throw new Error('Seat already exists on this flight');
    }

    // Tạo ghế mới nếu không tồn tại
    const seat = this.seatRepository.create({
      ...createSeatDto,
      flight,
    });

    return this.seatRepository.save(seat);
  }

  findAll() {
    return this.seatRepository.find({ relations: ['flight'] });
  }

  findOne(id: string) {
    return this.seatRepository.findOne({
      where: { id },
      relations: ['flight'],
    });
  }

  update(id: string, updateData: Partial<CreateSeatDto>) {
    return this.seatRepository.update(id, updateData);
  }

  remove(id: string) {
    return this.seatRepository.delete(id);
  }
}
