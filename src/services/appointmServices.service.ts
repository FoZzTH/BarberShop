import { Injectable, Inject } from '@nestjs/common';

import { AppointmServices } from '../models';

@Injectable()
export class AppointmServicesService {
  constructor(
    @Inject('AppointmServicesRepository')
    private readonly appointmServicesRepository: typeof AppointmServices,
  ) {}
}
