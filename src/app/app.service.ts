import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AppService {
  constructor(private readonly usersService: UsersService) {}
}
