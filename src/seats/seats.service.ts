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
    // Tìm flight dựa trên flight_id
    const flight = await this.flightRepository.findOneBy({
      id: createSeatDto.flight_id,
    });

    if (!flight) {
      throw new Error('Flight not found');
    }

    // Tạo bản ghi seat với flight
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
