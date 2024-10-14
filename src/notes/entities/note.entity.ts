import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('notes')
export class NoteEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;
}
