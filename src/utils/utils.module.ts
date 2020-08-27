import { Module, forwardRef } from '@nestjs/common';
import { UtilsService } from './utils.service';
import { UsersModule } from 'src/users/users.module';
import { AppointmentsModule } from 'src/appointments/appointments.module';
import { MastersModule } from 'src/masters/masters.module';
import { MailerModule } from 'src/mailer/mailer.module';

@Module({
  imports: [
    UsersModule,
    AppointmentsModule,
    MastersModule,
    MailerModule
  ],
  providers: [UtilsService],
  exports: [UtilsService],
})
export class UtilsModule {}
