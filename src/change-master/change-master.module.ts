import { Module, forwardRef } from '@nestjs/common';
import { ChangeMasterController } from './change-master.controller';
import { ChangeMasterService } from './change-master.service';
import { UtilsModule } from 'src/utils/utils.module';
import { AppointmentsModule } from 'src/appointments/appointments.module';
import { MailerModule } from 'src/mailer/mailer.module';
import { AppModule } from 'src/app/app.module';

@Module({
  imports: [
    forwardRef(() => AppModule),
    UtilsModule,
    AppointmentsModule,
    MailerModule,
  ],
  providers: [ChangeMasterController, ChangeMasterService],
  exports: [ChangeMasterController],
})
export class ChangeMasterModule {}
