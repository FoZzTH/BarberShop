import { Users } from '../models';

export const usersProvider = {
  provide: 'UsersRepository',
  useValue: Users,
};
