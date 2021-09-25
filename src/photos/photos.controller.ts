import { Controller, Get, Post, Body, Patch, Param, Delete, Headers } from '@nestjs/common';
import { PhotosService } from './photos.service';
import { TrackingsService } from '../trackings/trackings.service';
import jwt_decode from "jwt-decode";

@Controller('photos')
export class PhotosController {

  trackingsService:TrackingsService
  constructor( private readonly photosService: PhotosService ) {
    this.trackingsService = new TrackingsService()
  }

  @Post()
  async create(@Body() createPhoto: any,@Headers() headers:any) {
    var user:any = jwt_decode(headers.token)
    var data:any = await this.photosService.create({...createPhoto,createdByName:user.name,createdById:user.sub});
    if(data.status){
      /**
       * Tracking Action
       */
      await this.trackingsService.create({
          action:'CREATE',
          userByName:user.name,
          userById:user.sub,
          photoId:createPhoto._id
      });
    }

    return data;
  }

  @Get()
  findAll() {
    return this.photosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.photosService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePhotoDto: any, @Headers() headers:any) {
    var data:any = await this.photosService.update(id, updatePhotoDto)
   
    if(data.status){
      /**
       * Tracking Action
       */
      var user:any = jwt_decode(headers.token)
      await this.trackingsService.create({
          action:'UPDATE',
          userByName:user.name,
          userById:user.sub,
          photoId:id
      });
    }
    return data;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.photosService.remove(id);
  }

  @Post('sign')
  sign(@Body() fileObj: any) {
    return this.photosService.sign(fileObj);
  }
}
