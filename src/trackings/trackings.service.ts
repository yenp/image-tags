import { Injectable } from '@nestjs/common';
import Tracking from '../models/trackings';
import { v4 as uuidV4 } from 'uuid';
@Injectable()
export class TrackingsService {
  create(obj: any) {
    return new Promise<void>((resolve) => {
        var _id = new Date().getTime() + '_' + uuidV4();
        Tracking.create({...obj,_id},(err:any, result:any) => {
          resolve();
        }); 
    });
  }

  getTracking(photoId:string) {
    return new Promise((resolve) => {
        Tracking.query(photoId).exec(function(err,r:any) {
          console.log(err,r);
          resolve(r?r.Items:[])
        });
    });
  }
}
