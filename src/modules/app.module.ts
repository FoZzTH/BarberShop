import { Module } from '@nestjs/common';

import { AppController } from '../controllers/app.controller';
import { AppService } from '../services/app.service';

import { AppointmentsModule } from 'src/modules/appointments.module';

import { appointment } from 'src/consts/commands/sceneSwap.commands';
import { enterSceneCommand } from 'src/utils/enterScene.utils';

@Module({
  imports: [AppointmentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor() {
    enterSceneCommand(appointment);
  }
}
