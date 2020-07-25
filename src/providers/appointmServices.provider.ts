import { AppointmServices } from '../models';

export const appointmServicesProvider = {
  provide: 'AppointmServicesRepository',
  useValue: AppointmServices,
};
