import { Module } from '@nestjs/common';
import { NewAppointmentController } from './new-appointment.controller';
import { NewAppointmentService } from './new-appointment.service';
import { UsersModule } from 'src/users/users.module';
import { AppointmentsModule } from 'src/appointments/appointments.module';
import { MastersModule } from 'src/masters/masters.module';
import { UtilsModule } from 'src/utils/utils.module';

@Module({
  imports: [
    UsersModule,
    AppointmentsModule,
    MastersModule,
    UtilsModule,
  ],
  providers: [NewAppointmentController, NewAppointmentService],
  exports: [NewAppointmentController],
})
export class NewAppointmentModule {}
