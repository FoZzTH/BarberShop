import { Controller } from '@nestjs/common';
import { Stage } from 'telegraf';
import { BaseScene } from 'telegraf';
const { leave } = Stage;

import { appointmentScene } from '../scenes';

import {
  enterMessage,
  wrongCommand,
} from '../consts/messages/appointment.messages';
import {
  email,
  service,
  date,
  time,
  master,
  show,
  create,
} from 'src/consts/commands/appointment.commands';

import { getArgs } from '../utils/getArgs.utils';

@Controller('appointments')
export class AppointmentsController {
  constructor() {
    appointmentScene.enter(ctx => {
      ctx.scene.session.state = {
        counter: 0,
      };

      ctx.reply(enterMessage);
    });

    appointmentScene.help(ctx => {
      ctx.reply(enterMessage);
    });

    appointmentScene.command(email, ctx => {
      ctx.reply('Not implemented.');
    });

    appointmentScene.command(service, ctx => {
      ctx.reply('Not implemented.');
    });

    appointmentScene.command(date, ctx => {
      ctx.reply('Not implemented.');
    });

    appointmentScene.command(time, ctx => {
      ctx.reply('Not implemented.');
    });

    appointmentScene.command(master, ctx => {
      ctx.reply('Not implemented.');
    });

    appointmentScene.command(show, ctx => {
      ctx.reply('Not implemented.');
    });

    appointmentScene.command(create, ctx => {
      ctx.reply('Not implemented.');
    });

    appointmentScene.on('message', ctx => {
      ctx.reply(wrongCommand);
    });
  }
}
