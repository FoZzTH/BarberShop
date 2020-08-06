import { Module } from '@nestjs/common';
import { AbortController } from './abort.controller';
import { AppointmentsModule } from 'src/appointments/appointments.module';
import { UsersModule } from 'src/users/users.module';
import { AbortService } from './abort.service';
import { UtilsModule } from 'src/utils/utils.module';
import { MailerModule } from 'src/mailer/mailer.module';

@Module({
  imports: [AppointmentsModule, UsersModule, UtilsModule, MailerModule],
  controllers: [AbortController],
  providers: [AbortService],
})
export class AbortModule {}
