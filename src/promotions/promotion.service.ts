import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Promotion } from './entities/promotion.entity';
import { Flight } from 'src/flights/entities/flight.entity';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
@Injectable()
export class PromotionService {
  constructor(
    @InjectRepository(Promotion)
    private readonly promotionRepository: Repository<Promotion>,
    @InjectRepository(Flight)
    private readonly flightRepository: Repository<Flight>,
  ) {}

  async createPromotion(
    createPromotionDto: CreatePromotionDto,
  ): Promise<Promotion> {
    const { flightCodes, promotionCode, ...promotionData } = createPromotionDto;

    // Kiểm tra xem promotionCode đã tồn tại hay chưa
    const existingPromotionCode = await this.promotionRepository.findOne({
      where: { promotionCode },
    });

    if (existingPromotionCode) {
      throw new ConflictException(
        `Mã khuyến mãi "${promotionCode}" đã tồn tại. Vui lòng chọn mã khác.`,
      );
    }

    // Tìm các chuyến bay dựa trên flightCodes
    const flights = await this.flightRepository.find({
      where: flightCodes.map((code) => ({ flight_code: code })),
    });

    if (flights.length !== flightCodes.length) {
      throw new NotFoundException('Một hoặc nhiều chuyến bay không tồn tại.');
    }

    // Tạo khuyến mãi mới
    const promotion = this.promotionRepository.create({
      ...promotionData,
      promotionCode,
    });
    promotion.flights = flights;

    // Lưu khuyến mãi
    const savedPromotion = await this.promotionRepository.save(promotion);

    // Trả về khuyến mãi đã tạo sau khi format
    return this.formatPromotion(savedPromotion);
  }

  async updatePromotion(
    id: string,
    updatePromotionDto: UpdatePromotionDto,
  ): Promise<Promotion> {
    const { flightCodes, promotionCode, ...promotionData } = updatePromotionDto;

    // Tìm khuyến mãi theo ID
    const promotion = await this.promotionRepository.findOne({
      where: { id },
      relations: ['flights'],
    });

    if (!promotion) {
      throw new NotFoundException(`Khuyến mãi với ID "${id}" không tồn tại.`);
    }

    // Kiểm tra nếu `promotionCode` mới đã tồn tại (trừ chính nó)
    if (promotionCode && promotionCode !== promotion.promotionCode) {
      const existingPromotion = await this.promotionRepository.findOne({
        where: { promotionCode },
      });

      if (existingPromotion) {
        throw new ConflictException(
          `Mã khuyến mãi "${promotionCode}" đã tồn tại. Vui lòng chọn mã khác.`,
        );
      }

      promotion.promotionCode = promotionCode;
    }

    // Nếu có flightCodes, kiểm tra và cập nhật danh sách chuyến bay
    if (flightCodes) {
      const flights = await this.flightRepository.find({
        where: flightCodes.map((code) => ({ flight_code: code })),
      });

      if (flights.length !== flightCodes.length) {
        throw new NotFoundException('Một hoặc nhiều chuyến bay không tồn tại.');
      }

      promotion.flights = flights;
    }

    // Cập nhật các thông tin khác
    Object.assign(promotion, promotionData);

    // Lưu khuyến mãi sau khi cập nhật
    const updatedPromotion = await this.promotionRepository.save(promotion);

    // Trả về kết quả sau khi format
    return this.formatPromotion(updatedPromotion);
  }

  // Phương thức để định dạng dữ liệu
  private formatPromotion(promotion: Promotion): any {
    const discountValue =
      typeof promotion.discountValue === 'number'
        ? promotion.discountValue
        : parseFloat(promotion.discountValue);

    return {
      ...promotion,
      discountValue: discountValue.toFixed(2),
      flights: promotion.flights.map((flight) => ({
        id: flight.id,
        flight_code: flight.flight_code,
      })),
    };
  }

  async getAllPromotions(): Promise<any[]> {
    const promotions = await this.promotionRepository.find({
      relations: ['flights'],
    });

    return promotions.map(this.formatPromotion);
  }

  async getPromotionById(id: string): Promise<any> {
    const promotion = await this.promotionRepository.findOne({
      where: { id },
      relations: ['flights'],
    });

    if (!promotion) {
      throw new NotFoundException('Khuyến mãi không tồn tại.');
    }

    return this.formatPromotion(promotion);
  }

  async deletePromotion(id: string): Promise<void> {
    const promotion = await this.promotionRepository.findOne({
      where: { id },
    });

    if (!promotion) {
      throw new NotFoundException('Khuyến mãi không tồn tại.');
    }

    await this.promotionRepository.remove(promotion); // Xóa khuyến mãi
  }
}
