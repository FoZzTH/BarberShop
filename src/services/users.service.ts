import { Injectable } from '@nestjs/common';
import { UsersRepository } from 'src/repositories/users.repository';
import { SceneContextMessageUpdate } from 'telegraf/typings/stage';
import { IUsers } from 'src/interfaces/users.interface';
import { TelegrafContext } from 'telegraf/typings/context';
import { create } from 'src/consts/bot/commands/appointment.commands';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(
    ctx: SceneContextMessageUpdate | TelegrafContext,
  ): Promise<boolean> {
    const user: IUsers = {
      tel_id: ctx.from.id,
      first_name: ctx.from.first_name,
      last_name: ctx.from.last_name,
    };

    await this.usersRepository.create(user);

    return true;
  }

  async createInNotEx(
    ctx: SceneContextMessageUpdate | TelegrafContext,
  ): Promise<boolean> {
    if (await this.findByTelId(ctx)) {
      return false;
    }
    await this.create(ctx);
    return true;
  }

  findAll(): Promise<Array<IUsers>> {
    return this.usersRepository.findAll();
  }

  findByTelId(ctx: SceneContextMessageUpdate | TelegrafContext) {
    return this.usersRepository.findByTelId(ctx.from.id);
  }

  async update(
    ctx: SceneContextMessageUpdate | TelegrafContext,
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
