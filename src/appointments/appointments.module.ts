import { Module, forwardRef } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsRepository } from './appointments.repository';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    //forwardRef(() => UsersModule)
    UsersModule
  ],
  providers: [AppointmentsService, AppointmentsRepository],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}
