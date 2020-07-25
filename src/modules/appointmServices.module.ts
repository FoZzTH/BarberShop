import { Module } from '@nestjs/common';
import { DbModule } from './db.module';
import { AppointmServicesService } from '../services/appointmServices.service';
import { appointmServicesProvider } from '../providers/appointmServices.provider';

@Module({
  imports: [DbModule],
  providers: [AppointmServicesService, appointmServicesProvider],
  exports: [AppointmServicesService],
})
export class AppointmServicesModule {}
