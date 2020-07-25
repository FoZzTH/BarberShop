import { Messages } from '../models';

export const messagesProvider = {
  provide: 'MessagesRepository',
  useValue: Messages,
};
