import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { AirplanesService } from './airplanes.service';
import { CreateAirplaneDto } from './dto/create-airplane.dto';
import { UpdateAirplaneDto } from './dto/update-airplane.dto';

@Controller('airplanes')
export class AirplanesController {
  constructor(private readonly airplanesService: AirplanesService) {}

  @Post()
  create(@Body() createAirplaneDto: CreateAirplaneDto) {
    return this.airplanesService.create(createAirplaneDto);
  }

  @Get()
  findAll() {
    return this.airplanesService.findAll();
  }
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.airplanesService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateAirplaneDto: UpdateAirplaneDto,
  ) {
    return this.airplanesService.update(id, updateAirplaneDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.airplanesService.remove(id);
  }
}
