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

  async getFlightWithPromotions(flightCode: string): Promise<any> {
    const flight = await this.flightRepository.findOne({
      where: { flight_code: flightCode },
      relations: ['promotions', 'seats'], // Đảm bảo tải cả khuyến mãi và ghế
    });

    if (!flight) {
      throw new NotFoundException('Chuyến bay không tồn tại.');
    }

    // Kiểm tra nếu seats không phải là undefined hoặc null
    const availableSeats = flight.seats
      ? flight.seats.filter((seat) => !seat.isBooked) // Lọc ghế chưa được đặt
      : []; // Nếu không có ghế, trả về mảng rỗng

    // Chỉ chọn các thông tin cần thiết để trả về
    return {
      flight_code: flight.flight_code,
      airplane: flight.airplane,
      origin: flight.origin,
      destination: flight.destination,
      departure_time: flight.departure_time,
      arrival_time: flight.arrival_time,
      available_seat_classes: availableSeats.reduce((acc, seat) => {
        if (!acc[seat.ticket_class]) {
          acc[seat.ticket_class] = {
            availableSeats: 0,
            price: seat.price,
          };
        }
        acc[seat.ticket_class].availableSeats += 1; // Tăng số lượng ghế trống
        return acc;
      }, {}),
      promotions: flight.promotions.map((promotion) => ({
        promotionCode: promotion.promotionCode,
        title: promotion.title,
        description: promotion.description,
        discount: promotion.discountValue,
        discountType: promotion.discountType,
      })),
    };
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

    // Trả kết quả với thông tin các hạng ghế còn chỗ và giá của chúng
    return filteredFlights.map((flight) => {
      // Tạo một đối tượng thống kê số ghế trống và giá theo từng loại
      const seatClassesAvailability = flight.seats
        .filter((seat) => !seat.isBooked) // Lọc các ghế chưa được đặt
        .reduce(
          (acc, seat) => {
            // Nếu chưa có hạng ghế trong đối tượng, thêm vào
            if (!acc[seat.ticket_class]) {
              acc[seat.ticket_class] = {
                availableSeats: 0,
                price: Number(seat.price), // Giá của hạng ghế
              };
            }
            acc[seat.ticket_class].availableSeats += 1; // Tăng số lượng ghế trống
            return acc;
          },
          {} as Record<string, { availableSeats: number; price: number }>,
        );

      return {
        id: flight.id,
        flight_code: flight.flight_code,
        origin: flight.origin,
        destination: flight.destination,
        departure_time: flight.departure_time,
        arrival_time: flight.arrival_time,
        available_seat_classes: seatClassesAvailability, // Danh sách hạng ghế còn chỗ và giá
      };
    });
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

    // Helper function to get available seats and prices by class
    const getSeatAvailability = (seats: Seat[]) => {
      return seats
        .filter((seat) => !seat.isBooked) // Chỉ ghế chưa được đặt
        .reduce(
          (acc, seat) => {
            if (!acc[seat.ticket_class]) {
              acc[seat.ticket_class] = {
                availableSeats: 0,
                price: Number(seat.price),
              };
            }
            acc[seat.ticket_class].availableSeats += 1;
            return acc;
          },
          {} as Record<string, { availableSeats: number; price: number }>,
        );
    };

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
      relations: ['seats'],
    });

    const availableOutboundFlights = outboundFlights
      .map((flight) => {
        const seatAvailability = getSeatAvailability(flight.seats);
        const totalAvailableSeats = Object.values(seatAvailability).reduce(
          (sum, { availableSeats }) => sum + availableSeats,
          0,
        );
        return totalAvailableSeats >= totalPassengers
          ? {
              id: flight.id,
              flight_code: flight.flight_code,
              origin: flight.origin,
              destination: flight.destination,
              departure_time: flight.departure_time,
              arrival_time: flight.arrival_time,
              available_seat_classes: seatAvailability,
            }
          : null;
      })
      .filter(Boolean);

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

    const availableInboundFlights = inboundFlights
      .map((flight) => {
        const seatAvailability = getSeatAvailability(flight.seats);
        const totalAvailableSeats = Object.values(seatAvailability).reduce(
          (sum, { availableSeats }) => sum + availableSeats,
          0,
        );
        return totalAvailableSeats >= totalPassengers
          ? {
              id: flight.id,
              flight_code: flight.flight_code,
              origin: flight.origin,
              destination: flight.destination,
              departure_time: flight.departure_time,
              arrival_time: flight.arrival_time,
              available_seat_classes: seatAvailability,
            }
          : null;
      })
      .filter(Boolean);

    // 3. Trả kết quả
    return {
      outbound: availableOutboundFlights,
      inbound: availableInboundFlights,
    };
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
