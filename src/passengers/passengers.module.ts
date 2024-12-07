// passengers/passengers.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassengersService } from './passengers.service';
import { PassengersController } from './passengers.controller';
import { Passenger } from './entities/passenger.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Passenger])],
  providers: [PassengersService],
  controllers: [PassengersController],
  exports: [TypeOrmModule],
})
export class PassengersModule {}
