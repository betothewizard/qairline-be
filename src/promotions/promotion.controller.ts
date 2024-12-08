import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { Promotion } from './entities/promotion.entity';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
@Controller('promotions')
export class PromotionController {
  constructor(private readonly promotionService: PromotionService) {}

  @Post()
  async createPromotion(
    @Body() createPromotionDto: CreatePromotionDto,
  ): Promise<Promotion> {
    return this.promotionService.createPromotion(createPromotionDto);
  }

  @Get()
  async getAllPromotions(): Promise<Promotion[]> {
    return this.promotionService.getAllPromotions();
  }

  @Get(':id')
  async getPromotionById(@Param('id') id: string): Promise<Promotion> {
    return this.promotionService.getPromotionById(id);
  }

  @Patch(':id')
  async updatePromotion(
    @Param('id') id: string,
    @Body() updatePromotionDto: UpdatePromotionDto,
  ): Promise<Promotion> {
    return this.promotionService.updatePromotion(id, updatePromotionDto);
  }

  @Delete(':id')
  async deletePromotion(@Param('id') id: string): Promise<void> {
    return this.promotionService.deletePromotion(id);
  }
}
