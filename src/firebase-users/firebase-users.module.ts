import { Module } from '@nestjs/common';
import { FirebaseUsersController } from './firebase-users.controller';
import { FirebaseUsersService } from './firebase-users.service';
import { UsersModule } from 'src/users/users.module';
import { UtilsModule } from 'src/utils/utils.module';

@Module({
  imports: [UsersModule, UtilsModule],
  providers: [FirebaseUsersController, FirebaseUsersService],
  exports: [FirebaseUsersController],
})
export class FirebaseUsersModule {}
