import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto.js';
import { UsersService } from './users.service.js';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':username')
  getProfile(@Param('username') username: string) {
    return this.usersService.getProfile(username);
  }

  @Patch(':username/profile')
  updateProfile(
    @Param('username') username: string,
    @Body() body: UpdateUserProfileDto,
  ) {
    return this.usersService.updateProfile(username, body);
  }
}
