import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { FlightsService } from './flights.service';
import { CreateFlightDto } from './dto/create-flight.dto';
import { UpdateFlightDto } from './dto/update-flight.dto';
import { SearchFlightDto } from './dto/searchFlight.dto';
import { SearchRoundTripFlightDto } from './dto/searchRoundTripFlights.dto';
import { Flight } from './entities/flight.entity';

@Controller('flights')
export class FlightsController {
  constructor(private readonly flightsService: FlightsService) {}

  @Post()
  create(@Body() createFlightDto: CreateFlightDto) {
    return this.flightsService.create(createFlightDto);
  }

  @Get('all')
  findAll() {
    return this.flightsService.findAll();
  }

  @Get('search')
  async searchFlights(@Query() searchFlightDto: SearchFlightDto) {
    const flights =
      await this.flightsService.searchFlightsWithPassengers(searchFlightDto);

    if (flights.length === 0) {
      throw new BadRequestException(
        'No flights available with enough seats for the requested passengers.',
      );
    }

    return flights;
  }

  @Get('search-roundtrip')
  async searchRoundTrip(@Query() dto: SearchRoundTripFlightDto) {
    return this.flightsService.searchRoundTripFlights(dto);
  }

  @Get(':flightCode')
  async getFlightWithPromotions(
    @Param('flightCode') flightCode: string,
  ): Promise<Flight> {
    return this.flightsService.getFlightWithPromotions(flightCode);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.flightsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFlightDto: UpdateFlightDto) {
    return this.flightsService.update(id, updateFlightDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.flightsService.remove(id);
  }
}
