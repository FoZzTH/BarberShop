import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NewAppointmentModule } from 'src/new-appointment/new-appointment.module';
import { UsersModule } from 'src/users/users.module';
import { AppointmentsModule } from 'src/appointments/appointments.module';
import { AbortModule } from 'src/abort/abort.module';
import { UtilsModule } from 'src/utils/utils.module';
import { ChangeDateModule } from 'src/change-date/change-date.module';
import { ChangeMasterModule } from 'src/change-master/change-master.module';
import { ChangeServiceModule } from 'src/change-service/change-service.module';
import { MailerModule } from 'src/mailer/mailer.module';

@Module({
  imports: [
    UtilsModule,
    UsersModule,
    AppointmentsModule,
    NewAppointmentModule,
    AbortModule,
    ChangeDateModule,
    ChangeMasterModule,
    ChangeServiceModule,
    MailerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
