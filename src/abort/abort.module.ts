import { Module, forwardRef } from '@nestjs/common';
import { AbortController } from './abort.controller';
import { AppointmentsModule } from 'src/appointments/appointments.module';
import { AbortService } from './abort.service';
import { UtilsModule } from 'src/utils/utils.module';
import { MailerModule } from 'src/mailer/mailer.module';
import { AppModule } from 'src/app/app.module';

@Module({
  imports: [
    forwardRef(() => AppModule),
    AppointmentsModule,
    UtilsModule,
    MailerModule,
  ],
  providers: [AbortController, AbortService],
  exports: [AbortController],
})
export class AbortModule {}
