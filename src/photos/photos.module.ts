import { Module } from '@nestjs/common';
import { PhotosService } from './photos.service';
import { PhotosController } from './photos.controller';
import { TrackingsService } from '../trackings/trackings.service';

@Module({
  imports:[
    TrackingsService
  ],
  controllers: [PhotosController],
  providers: [PhotosService]
})
export class PhotosModule {}
