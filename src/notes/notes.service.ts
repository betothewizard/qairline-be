import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NoteEntity } from 'src/notes/entities/note.entity';
import { Repository } from 'typeorm';
import { NotesDto } from 'src/notes/dto/notes.dto';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(NoteEntity)
    private notesRepository: Repository<NoteEntity>,
  ) {}
  async create(notesDto: NotesDto): Promise<NoteEntity> {
    const note = this.notesRepository.create(notesDto);
    return this.notesRepository.save(note);
  }

  async findAll(): Promise<NoteEntity[]> {
    return this.notesRepository.find();
  }

  async findOne(id: number): Promise<NoteEntity> {
    return this.notesRepository.findOneBy({ id });
  }

  async update(id: number, notesDto: NotesDto): Promise<NoteEntity> {
    await this.notesRepository.update(id, notesDto);
    return this.findOne(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.notesRepository.delete(id);
    return result.affected > 0;
  }
}
