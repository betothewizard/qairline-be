import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { BookingModule } from './bookings/bookings.module';
import { PostsModule } from './posts/posts.module';
import { FlightsModule } from './flights/flights.module';
import { AirplanesModule } from './airplanes/airplanes.module';
import { SeatsModule } from './seats/seats.module';
import { BookingSeatModule } from './booking-seats/booking-seat.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    FlightsModule,
    BookingModule,
    PostsModule,
    AirplanesModule,
    SeatsModule,
    BookingSeatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
