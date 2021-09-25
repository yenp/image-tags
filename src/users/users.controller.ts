import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  register(@Body() createUser: any) {
    return this.usersService.create(createUser);
  }

  @Post('login')
  async login(@Body() userObj: any) {
    return await this.usersService.login(userObj);
  }
  
}
