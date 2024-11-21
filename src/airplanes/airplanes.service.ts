import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Airplane } from './entities/airplane.entity';
import { CreateAirplaneDto } from './dto/create-airplane.dto';
import { UpdateAirplaneDto } from './dto/update-airplane.dto';

@Injectable()
export class AirplanesService {
  constructor(
    @InjectRepository(Airplane)
    private readonly airplaneRepository: Repository<Airplane>,
  ) {}

  async create(createAirplaneDto: CreateAirplaneDto): Promise<Airplane> {
    const airplane = this.airplaneRepository.create(createAirplaneDto);
    return await this.airplaneRepository.save(airplane);
  }

  async findAll(): Promise<Airplane[]> {
    return await this.airplaneRepository.find();
  }

  async findOne(id: number): Promise<Airplane> {
    return await this.airplaneRepository.findOneBy({ id });
  }

  async update(
    id: number,
    updateAirplaneDto: UpdateAirplaneDto,
  ): Promise<Airplane> {
    const airplane = await this.airplaneRepository.findOne({ where: { id } });

    if (!airplane) {
      throw new Error('Airplane not found');
    }
    if (updateAirplaneDto.last_service_at) {
      airplane.last_service_at = new Date(updateAirplaneDto.last_service_at);
    }

    return this.airplaneRepository.save(airplane);
  }

  async remove(id: number): Promise<void> {
    await this.airplaneRepository.delete(id);
  }
}
