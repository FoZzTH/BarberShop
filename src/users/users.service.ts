import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { ITelCtx } from 'src/interfaces/ctx.interface';
import { IUsers } from './users.interface';

import { admin } from '../firebase';
import { procCommand } from 'src/app/app.commands';
import { noActionState } from './users.state';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async firebaseCreate(user: IUsers) {
    const token = await admin.auth().createCustomToken(user.id.toString());
    await admin
      .database()
      .ref('users/' + user.id)
      .set({
        user_id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        state: user.state,
        token: token,
      });
  }

  async firebaseFindAll(): Promise<any> {
    const users = await admin
      .database()
      .ref('users/')
      .once('value');
    return users.val();
  }

  async create(ctx: ITelCtx): Promise<boolean> {
    const user: IUsers = {
      tel_id: ctx.from.id,
      first_name: ctx.from.first_name,
      last_name: ctx.from.last_name,
      state: noActionState,
    };

    await this.usersRepository.create(user);

    const dbUser = await this.findByTelId(ctx);
    await this.firebaseCreate(dbUser);

    return true;
  }

  async createIfNotEx(ctx: ITelCtx): Promise<boolean> {
    if (await this.findByTelId(ctx)) {
      return false;
    }

    await this.create(ctx);

    return true;
  }

  findAll(): Promise<Array<IUsers>> {
    return this.usersRepository.findAll();
  }

  async findByTelId(ctx: ITelCtx): Promise<IUsers> {
    const users = await this.usersRepository.findByTelId(ctx.from.id);

    return users[0];
  }

  async update(
    ctx: ITelCtx,
    column: string,
    to: string | number | boolean,
  ): Promise<boolean> {
    const user = await this.findByTelId(ctx);

    if (!user) {
      return false;
    }

    await this.usersRepository.update(ctx.from.id, column, to);

    return true;
  }
}
