import { Module } from '@nestjs/common';
import { MastersService } from './masters.service';
import { MastersRepository } from './masters.repository';

@Module({
  providers: [MastersService, MastersRepository],
  exports: [MastersService],
})
export class MastersModule {}
