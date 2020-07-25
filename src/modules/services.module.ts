import { Module } from '@nestjs/common';
import { DbModule } from './db.module';
import { ServicesService } from '../services/services.service';
import { servicesProvider } from '../providers/services.provider';

@Module({
  imports: [DbModule],
  providers: [ServicesService, servicesProvider],
  exports: [ServicesService],
})
export class ServicesModule {}
