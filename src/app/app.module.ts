import { Module, forwardRef } from '@nestjs/common';
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
import { FirebaseUsersModule } from 'src/firebase-users/firebase-users.module';

@Module({
  imports: [
    UtilsModule,
    AppointmentsModule,
    FirebaseUsersModule,
    UsersModule,
    NewAppointmentModule,
    ChangeDateModule,
    ChangeMasterModule,
    ChangeServiceModule,
    AbortModule,
  ],
  providers: [AppController, AppService],
  exports: [AppController],
})
export class AppModule {}
