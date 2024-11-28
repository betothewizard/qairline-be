import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Flight } from './entities/flight.entity';
import { CreateFlightDto } from './dto/create-flight.dto';
import { UpdateFlightDto } from './dto/update-flight.dto';

@Injectable()
export class FlightsService {
  constructor(
    @InjectRepository(Flight)
    private readonly flightRepository: Repository<Flight>,
  ) {}

  async create(createFlightDto: CreateFlightDto): Promise<Flight> {
    const flight = this.flightRepository.create(createFlightDto);
    return this.flightRepository.save(flight);
  }

  findAll(): Promise<Flight[]> {
    return this.flightRepository.find({ relations: ['airplane'] });
  }

  findOne(id: string): Promise<Flight> {
    return this.flightRepository.findOne({
      where: { id },
      relations: ['airplane'],
    });
  }

  async searchFlights(
    departure: string,
    arrival: string,
    departureDate: string,
  ) {
    const startOfDay = new Date(departureDate);
    const endOfDay = new Date(departureDate);
    endOfDay.setHours(23, 59, 59, 999); // Kết thúc ngày

    return await this.flightRepository.find({
      where: {
        origin: departure,
        destination: arrival,
        departure_time: Between(startOfDay, endOfDay), // Tìm trong khoảng ngày
      },
    });
  }

  async update(id: string, updateFlightDto: UpdateFlightDto): Promise<Flight> {
    await this.flightRepository.update(id, updateFlightDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.flightRepository.delete(id);
  }
}
