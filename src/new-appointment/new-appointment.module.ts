import { Module, forwardRef } from '@nestjs/common';
import { NewAppointmentController } from './new-appointment.controller';
import { NewAppointmentService } from './new-appointment.service';
import { UsersModule } from 'src/users/users.module';
import { AppointmentsModule } from 'src/appointments/appointments.module';
import { MastersModule } from 'src/masters/masters.module';
import { UtilsModule } from 'src/utils/utils.module';
import { AppModule } from 'src/app/app.module';

@Module({
  imports: [
    forwardRef(() => AppModule),
    UsersModule,
    AppointmentsModule,
    MastersModule,
    UtilsModule,
  ],
  providers: [NewAppointmentController, NewAppointmentService],
  exports: [NewAppointmentController],
})
export class NewAppointmentModule {}
