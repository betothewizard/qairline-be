import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './Users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/Users/entities/user.entity';
import { DataSource } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { RefreshTokenEntity } from './Tokens/entities/refresh_token.entity';
import { AuthModule } from './Auth/auth.module';
import { BookingsModule } from './bookings/bookings.module';
import { Flight } from './flights/entities/flight.entity';
import { Seat } from './seats/entities/seat.entity';
import { Booking } from './bookings/entities/booking.entity';
import { BookingSeat } from './bookings/entities/booking_seat.entity';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      entities: [UserEntity],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([
      UserEntity,
      RefreshTokenEntity,
      Flight,
      Seat,
      Booking,
      BookingSeat,
    ]),
    UsersModule,
    AuthModule,
    BookingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
