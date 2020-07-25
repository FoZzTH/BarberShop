import { Module } from '@nestjs/common';
import { DbModule } from './db.module';
import { AppointmentsService } from '../services/appointments.service';
import { appointmentsProvider } from '../providers/appointments.provider';

@Module({
  imports: [DbModule],
  providers: [AppointmentsService, appointmentsProvider],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}
