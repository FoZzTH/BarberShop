import { Module } from '@nestjs/common';
import { ChangeServiceController } from './change-service.controller';
import { ChangeServiceService } from './change-service.service';
import { UtilsModule } from 'src/utils/utils.module';
import { AppointmentsModule } from 'src/appointments/appointments.module';
import { MailerModule } from 'src/mailer/mailer.module';

@Module({
  imports: [
    UtilsModule,
    AppointmentsModule,
    MailerModule,
  ],
  providers: [ChangeServiceController, ChangeServiceService],
  exports: [ChangeServiceController],
})
export class ChangeServiceModule {}
