import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { RefreshTokenEntity } from 'src/tokens/entities/refresh_token.entity';
@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userName: string;

  @Column()
  passWord: string;

  @OneToMany(() => RefreshTokenEntity, (refreshToken) => refreshToken.user)
  refreshTokens: RefreshTokenEntity[];
}
