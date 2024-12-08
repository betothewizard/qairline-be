import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Flight } from './entities/flight.entity';
import { CreateFlightDto } from './dto/create-flight.dto';
import { UpdateFlightDto } from './dto/update-flight.dto';
import { Seat } from 'src/seats/entities/seat.entity';
import { SearchFlightDto } from './dto/searchFlight.dto';
import { SearchRoundTripFlightDto } from './dto/searchRoundTripFlights.dto';

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

  async getFlightWithPromotions(flightCode: string): Promise<Flight> {
    const flight = await this.flightRepository.findOne({
      where: { flight_code: flightCode },
      relations: ['promotions'], // Tải các khuyến mãi liên kết với chuyến bay
    });

    if (!flight) {
      throw new NotFoundException('Chuyến bay không tồn tại.');
    }

    return flight;
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

  async searchRoundTripFlights(dto: SearchRoundTripFlightDto) {
    const {
      departure,
      arrival,
      departure_date,
      return_date,
      adults,
      children,
    } = dto;
    const totalPassengers = Number(adults) + Number(children);

    // 1. Tìm chuyến bay đi
    const outboundFlights = await this.flightRepository.find({
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

    const availableOutboundFlights = outboundFlights.filter(
      (flight) => this.calculateAvailableSeats(flight.seats) >= totalPassengers,
    );

    // 2. Tìm chuyến bay về (nếu có)
    const inboundFlights = return_date
      ? await this.flightRepository.find({
          where: {
            origin: arrival,
            destination: departure,
            departure_time: Between(
              new Date(`${return_date} 00:00:00`),
              new Date(`${return_date} 23:59:59`),
            ),
          },
          relations: ['seats'],
        })
      : [];

    const availableInboundFlights = inboundFlights.filter(
      (flight) => this.calculateAvailableSeats(flight.seats) >= totalPassengers,
    );

    // 3. Trả về kết quả chỉ bao gồm thông tin cần thiết
    const roundTripResults = {
      outbound: availableOutboundFlights.map((flight) => ({
        id: flight.id,
        flight_code: flight.flight_code,
        origin: flight.origin,
        destination: flight.destination,
        departure_time: flight.departure_time,
        arrival_time: flight.arrival_time,
        available_seats: flight.seats.filter((seat) => !seat.isBooked).length, // Số ghế còn
      })),
      inbound: availableInboundFlights.map((flight) => ({
        id: flight.id,
        flight_code: flight.flight_code,
        origin: flight.origin,
        destination: flight.destination,
        departure_time: flight.departure_time,
        arrival_time: flight.arrival_time,
        available_seats: flight.seats.filter((seat) => !seat.isBooked).length, // Số ghế còn
      })),
    };

    // Nếu không có chuyến bay đi, trả về mảng chuyến bay về nếu có
    if (!availableOutboundFlights.length && availableInboundFlights.length) {
      const filteredInboundFlights = availableInboundFlights.map((flight) => ({
        id: flight.id,
        flight_code: flight.flight_code,
        origin: flight.origin,
        destination: flight.destination,
        departure_time: flight.departure_time,
        arrival_time: flight.arrival_time,
        available_seats: flight.seats.filter((seat) => !seat.isBooked).length, // Tính số ghế còn
      }));
      return { outbound: [], inbound: filteredInboundFlights };
    }

    return roundTripResults;
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
