import { Appointments } from '../models';

export const appointmentsProvider = {
  provide: 'AppointmentsRepository',
  useValue: Appointments,
};
