// passengers/passengers.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Passenger } from './entities/passenger.entity';
import { CreatePassengerDto } from './dto/create-passenger.dto';

@Injectable()
export class PassengersService {
  constructor(
    @InjectRepository(Passenger)
    private passengerRepository: Repository<Passenger>,
  ) {}

  // Tạo hành khách mới
  async create(createPassengerDto: CreatePassengerDto): Promise<Passenger> {
    const passenger = this.passengerRepository.create(createPassengerDto);
    return this.passengerRepository.save(passenger);
  }

  // Lấy tất cả hành khách
  async findAll(): Promise<Passenger[]> {
    return this.passengerRepository.find();
  }

  // Lấy hành khách theo id
  async findOne(id: string): Promise<Passenger> {
    return this.passengerRepository.findOneBy({ id: id });
  }
}
