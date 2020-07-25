import { Module } from '@nestjs/common';

import { dbService } from '../services/db.service';

@Module({
  providers: [dbService],
  exports: [dbService],
})
export class DbModule {}
