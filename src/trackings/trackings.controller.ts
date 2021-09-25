import { Controller,Get, Param} from '@nestjs/common';
import { TrackingsService } from './trackings.service';

@Controller('trackings')
export class TrackingsController {
  constructor(private readonly trackingsService: TrackingsService) {}

  @Get(':photoId')
  getTracking(@Param('photoId') photoId: any) {
    return this.trackingsService.getTracking(photoId);
  }

}
