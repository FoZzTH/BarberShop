import { Injectable } from '@nestjs/common';
import { ITelCtx } from 'src/interfaces/ctx.interface';
import {
  haircutService,
  shavingService,
  bothService,
} from 'src/appointments/appointments-services';
import { MastersService } from 'src/masters/masters.service';

import * as Joi from '@hapi/joi';

import { AppointmentsService } from 'src/appointments/appointments.service';
import { UtilsService } from 'src/utils/utils.service';

@Injectable()
export class NewAppointmentService {
  constructor(
    private readonly mastersService: MastersService,
    private readonly utils: UtilsService,
    private readonly appointmentsService: AppointmentsService,
  ) {}

  async checkEmail(ctx: ITelCtx): Promise<boolean> {
    const schema = Joi.string().email({ tlds: { allow: false } });

    const { error } = await schema.validate(ctx.text);

    return !error;
  }
}
