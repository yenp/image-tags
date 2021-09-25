import { Test, TestingModule } from '@nestjs/testing';
import { any } from 'joi';
import { PhotosController } from './photos.controller';
import { PhotosService } from './photos.service';
describe('PhotosController', () => {
  let photosController: PhotosController;
  let photosService: PhotosService;

  beforeEach(async () => {
    photosService = new PhotosService();
    photosController = new PhotosController(photosService);
  });

  it('should be defined', () => {
    expect(photosController).toBeDefined();
  });

  it('test findAll', async () => {
      expect(await photosController.findAll()).toBeInstanceOf(Array);
  });

  it('test Create / FindOne / Delete', async () => {
      // expect(await photosController.findAll()).toBeInstanceOf(Array);
  });

});
