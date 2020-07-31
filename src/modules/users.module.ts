import { Module } from '@nestjs/common';
import { UsersService } from 'src/services/users.service';
import { UsersRepository } from 'src/repositories/users.repository';

@Module({
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
