import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seat } from './entities/seat.entity';
import { SeatController } from './seats.controller';
import { SeatService } from './seats.service';
import { FlightsModule } from 'src/flights/flights.module';

@Module({
  imports: [TypeOrmModule.forFeature([Seat]), FlightsModule],
  controllers: [SeatController],
  providers: [SeatService],
  exports: [TypeOrmModule],
})
export class SeatsModule {}
