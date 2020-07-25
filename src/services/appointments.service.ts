import { Injectable, Inject } from '@nestjs/common';

import { Appointments } from '../models';

@Injectable()
export class AppointmentsService {
  constructor(
    @Inject('AppointmentsRepository')
    private readonly appointmentsRepository: typeof Appointments,
  ) {}
}
