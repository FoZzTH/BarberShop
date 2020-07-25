import { Services } from '../models';

export const servicesProvider = {
  provide: 'ServicesRepository',
  useValue: Services,
};
