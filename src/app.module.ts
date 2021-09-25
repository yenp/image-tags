import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PhotosModule } from './photos/photos.module';
import { ConfigModule } from '@nestjs/config';
import { TrackingsModule } from './trackings/trackings.module';

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: '.env',
    isGlobal: true,
  }),UsersModule, PhotosModule, TrackingsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
