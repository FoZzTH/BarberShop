import { Injectable, Inject } from '@nestjs/common';
import { FindOptions } from 'sequelize/types';

import { Users } from '../models';
import { IUser } from '../interfaces/user.interfaces';

@Injectable()
export class UsersService {
  constructor(
    @Inject('UsersRepository') private readonly usersRepository: typeof Users,
  ) {}

  // public findOne(options: FindOptions): Promise<Users | null> {
  //   return this.usersRepository.findOne(options);
  // }

  // public findByTelId(id: number): Promise<Users | null> {
  //   return this.usersRepository.findOne({
  //     where: {
  //       tel_id: id,
  //     },
  //   });
  // }

  // public async createUserIfNotEx(ctx: ITelRes): Promise<Users | null> {
  //   const user: IUser = {
  //     tel_id: ctx.from.id,
  //     email: '',
  //     firstName: ctx.from.first_name,
  //     lastName: ctx.from.last_name,
  //     state: noAction,
  //   };

  //   const dbUser = await this.findByTelId(ctx.from.id);

  //   if (dbUser) {
  //     return dbUser;
  //   }

  //   return this.usersRepository.create(user);
  // }

  // public async changeState(tel_id: number, to: string): Promise<Users | null> {
  //   const user = await this.findByTelId(tel_id);

  //   if (!user) {
  //     return null;
  //   }

  //   return this.usersRepository.update(
  //     {
  //       state: to,
  //     },
  //     { where: { tel_id: tel_id } },
  //   );
  // }

  // public async isStateNotActive(
  //   ctx: ITelRes,
  //   state: string,
  // ): Promise<boolean | null> {
  //   let user = await this.findByTelId(ctx.from.id);

  //   if (!user) {
  //     user = await this.createUserIfNotEx(ctx);
  //   }

  //   return user.state !== state;
  // }

  // public async setEmail(tel_id: number, email: string): Promise<Users | null> {
  //   const user = await this.findByTelId(tel_id);

  //   if (!user) {
  //     return;
  //   }

  //   return this.usersRepository.update(
  //     {
  //       email: email,
  //     },
  //     { where: { tel_id: tel_id } },
  //   );
  // }
}
