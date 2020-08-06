import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { ITelCtx } from 'src/interfaces/ctx.interface';
import { IUsers } from './users.interface';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(ctx: ITelCtx): Promise<boolean> {
    const user: IUsers = {
      tel_id: ctx.from.id,
      first_name: ctx.from.first_name,
      last_name: ctx.from.last_name,
    };

    await this.usersRepository.create(user);

    return true;
  }

  async createInNotEx(ctx: ITelCtx): Promise<boolean> {
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

    if (!users[0]) {
      await this.create(ctx);
      return this.findByTelId(ctx);
    }

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
