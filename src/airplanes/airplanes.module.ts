import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Airplane } from './entities/airplane.entity';
import { AirplanesController } from './airplanes.controller';
import { AirplanesService } from './airplanes.service';

@Module({
  imports: [TypeOrmModule.forFeature([Airplane])],
  controllers: [AirplanesController],
  providers: [AirplanesService],
})
export class AirplanesModule {}
