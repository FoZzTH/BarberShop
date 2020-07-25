import { Injectable, Inject } from '@nestjs/common';

import { Messages } from '../models';

@Injectable()
export class MessagesService {
  constructor(
    @Inject('MessagesRepository')
    private readonly messagesRepository: typeof Messages,
  ) {}
}
