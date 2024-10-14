import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ValidationPipe,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesDto } from './dto/notes.dto';
import { NoteEntity } from './entities/note.entity';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  async getAll(): Promise<NoteEntity[]> {
    return this.notesService.findAll();
  }

  @Post()
  async create(
    @Body(new ValidationPipe()) notesDto: NotesDto,
  ): Promise<NoteEntity> {
    return this.notesService.create(notesDto);
  }

  @Get('/:id')
  async findOne(@Param('id') id: number): Promise<NoteEntity> {
    return this.notesService.findOne(id);
  }

  @Put('/:id')
  async update(
    @Param('id') id: number,
    @Body() notesDto: NotesDto,
  ): Promise<NoteEntity> {
    return this.notesService.update(id, notesDto);
  }

  @Delete('/:id')
  async delete(@Param('id') id: number): Promise<boolean> {
    return this.notesService.delete(id);
  }
}
