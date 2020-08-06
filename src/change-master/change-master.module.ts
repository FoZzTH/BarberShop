import { Module } from '@nestjs/common';
import { ChangeMasterController } from './change-master.controller';
import { ChangeMasterService } from './change-master.service';
import { UtilsModule } from 'src/utils/utils.module';
import { AppointmentsModule } from 'src/appointments/appointments.module';
import { MailerModule } from 'src/mailer/mailer.module';

@Module({
  imports: [UtilsModule, AppointmentsModule, MailerModule],
  controllers: [ChangeMasterController],
  providers: [ChangeMasterService],
})
export class ChangeMasterModule {}
