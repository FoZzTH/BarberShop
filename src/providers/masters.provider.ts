import { Masters } from '../models';

export const mastersProvider = {
  provide: 'MastersRepository',
  useValue: Masters,
};
