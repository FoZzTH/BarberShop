import { Module } from '@nestjs/common';

import { BotController } from '../controllers/bot.controller';
import { BotService } from '../services/bot.service';
import { UsersModule } from './users.module';
import { AppointmentsModule } from './appointments.module';
import { MessagesModule } from './messages.module';
import { MastersModule } from './masters.module';
import { ServicesModule } from './services.module';

import { DbModule } from './db.module';

@Module({
  imports: [
    DbModule,
    UsersModule,
    AppointmentsModule,
    MessagesModule,
    MastersModule,
    ServicesModule
  ],
  controllers: [BotController],
  providers: [BotService],
})
export class BotModule {}
