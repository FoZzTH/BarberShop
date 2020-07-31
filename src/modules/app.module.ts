import { Module } from '@nestjs/common';

import { AppController } from '../controllers/app.controller';

import { AppointmentsModule } from 'src/modules/appointments.module';
import { UsersModule } from './users.module';

import { appointment } from 'src/consts/bot/commands/sceneSwap.commands';
import { enterSceneCommand } from 'src/utils/enterScene.utils';

@Module({
  imports: [AppointmentsModule, UsersModule],
  controllers: [AppController],
})
export class AppModule {
  constructor() {
    enterSceneCommand(appointment);
  }
}
