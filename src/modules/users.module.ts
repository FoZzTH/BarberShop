import { Module } from '@nestjs/common';
import { DbModule } from './db.module';
import { UsersService } from '../services/users.service';
import { usersProvider } from '../providers/user.provider';

@Module({
  imports: [DbModule],
  providers: [UsersService, usersProvider],
  exports: [UsersService],
})
export class UsersModule {}
