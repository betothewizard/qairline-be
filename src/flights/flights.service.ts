import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Flight } from './entities/flight.entity';
import { CreateFlightDto } from './dto/create-flight.dto';
import { UpdateFlightDto } from './dto/update-flight.dto';
import { Seat } from 'src/seats/entities/seat.entity';
import { SearchFlightDto } from './dto/searchFlight.dto';

@Injectable()
export class FlightsService {
  constructor(
    @InjectRepository(Flight)
    private readonly flightRepository: Repository<Flight>,

    @InjectRepository(Seat)
    private readonly seatRepository: Repository<Seat>,
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

  // flights.service.ts
  async searchFlightsWithPassengers(dto: SearchFlightDto) {
    const { departure, arrival, departure_date, adults, children } = dto;
    const totalPassengers = Number(adults) + Number(children);

    // Tìm kiếm chuyến bay
    const flights = await this.flightRepository.find({
      where: {
        origin: departure,
        destination: arrival,
        departure_time: Between(
          new Date(`${departure_date} 00:00:00`),
          new Date(`${departure_date} 23:59:59`),
        ),
      },
      relations: ['seats'], // Lấy thông tin ghế
    });

    // Lọc các chuyến bay đủ ghế cho tổng số hành khách
    const filteredFlights = flights.filter(
      (flight) => this.calculateAvailableSeats(flight.seats) >= totalPassengers,
    );

    // Trả kết quả với số ghế còn trống
    return filteredFlights.map((flight) => ({
      id: flight.id,
      flight_code: flight.flight_code,
      origin: flight.origin,
      destination: flight.destination,
      departure_time: flight.departure_time,
      arrival_time: flight.arrival_time,
      available_seats: flight.seats.filter((seat) => !seat.isBooked).length, // Số ghế còn
    }));
  }

  async update(id: string, updateFlightDto: UpdateFlightDto): Promise<Flight> {
    await this.flightRepository.update(id, updateFlightDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.flightRepository.delete(id);
  }

  private calculateAvailableSeats(seats: Seat[]): number {
    return seats.filter((seat) => !seat.isBooked).length;
  }
}
