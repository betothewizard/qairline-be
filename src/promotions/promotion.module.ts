import { Module } from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { PromotionController } from './promotion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Promotion } from './entities/promotion.entity';
import { Flight } from 'src/flights/entities/flight.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Promotion, Flight])],
  providers: [PromotionService],
  controllers: [PromotionController],
})
export class PromotionModule {}
