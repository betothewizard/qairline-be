import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Flight } from './entities/flight.entity';
import { FlightsController } from './flights.controller';
import { FlightsService } from './flights.service';
import { Seat } from 'src/seats/entities/seat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Flight, Seat])],
  controllers: [FlightsController],
  providers: [FlightsService],
  exports: [TypeOrmModule],
})
export class FlightsModule {}
