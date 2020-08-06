import { Module, forwardRef } from '@nestjs/common';
import { ChangeDateController } from './change-date.controller';
import { ChangeDateService } from './change-date.service';
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
  providers: [ChangeDateController, ChangeDateService],
  exports: [ChangeDateController],
})
export class ChangeDateModule {}
