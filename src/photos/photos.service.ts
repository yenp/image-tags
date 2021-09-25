import { Injectable, Headers } from '@nestjs/common';
import {S3} from 'aws-sdk'
import * as Mime from 'mime';
import { v4 as uuidV4 } from 'uuid';
import Photo from '../models/photos';
import {extname} from 'path'
import {error, success} from '../config/jsonText'


@Injectable()
export class PhotosService {
  
  create = async (createPhotoDto: any) =>  {
    return new Promise((resolve) => {
        Photo.create(createPhotoDto,(err:any, result:any) => {
          resolve(err?error:success);
        }); 
    });
  }

  findAll = async () => {
    return new Promise((resolve) => {
        Photo.scan().exec((err,r)=>{
          resolve(r ? r.Items : []);
        }); 
    });
  }

  findOne(id: string) {
    return new Promise((resolve) => {
        Photo.get({_id:id},function(err,r) {
          resolve(r ? r : null);
        }); 
    });
  }

  update(id: string, updatePhotoDto: any) {
    return new Promise((resolve) => {
      Photo.update({...updatePhotoDto,_id:id},(err:any, result:any) => {
        resolve(err?error:success);
      }); 
    });
  }

  remove(id: string) {
    return new Promise((resolve) => {
        Photo.destroy({_id:id},function(err,r) {
          resolve(err ? error : success);
        }); 
    });
  }

  sign(dataSign:any) {
    return new Promise((resolve)=>{
      var id = uuidV4();
      var name = 'data-photos/'+ id + (extname(dataSign.name));
      const params = { 
        Expires: 300,
        Bucket: process.env.BUCKET_DATA,
        Conditions: [["content-length-range", 100, 50000000]], // 100Byte - 50MB
        Fields: {
          "Content-Type": Mime.getType(dataSign.name),
          key:name,
          acl:'public-read',
          imageId:id
        }
      };
      const s3 = new S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID_ENV,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_ENV,
        signatureVersion: 'v4'
      });
      s3.createPresignedPost(params, (err, data) => {
        resolve(data)
      });
    });
  }

}
