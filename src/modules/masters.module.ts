import { Module } from '@nestjs/common';
import { DbModule } from './db.module';
import { MastersService } from '../services/masters.service';
import { mastersProvider } from '../providers/masters.provider';

@Module({
  imports: [DbModule],
  providers: [MastersService, mastersProvider],
  exports: [MastersService],
})
export class MastersModule {}
