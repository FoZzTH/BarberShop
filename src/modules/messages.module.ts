import { Module } from '@nestjs/common';
import { DbModule } from './db.module';
import { MessagesService } from '../services/messages.service';
import { messagesProvider } from '../providers/messages.provider';

@Module({
  imports: [DbModule],
  providers: [MessagesService, messagesProvider],
  exports: [MessagesService],
})
export class MessagesModule {}
