import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  homeData(): any {
    return {
      title : "Manage Images and Their Tags",
      message: "Welcome to demo"
    }
  }
}
