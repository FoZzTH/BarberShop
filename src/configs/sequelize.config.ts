import { SequelizeOptions } from 'sequelize-typescript';
import { Dialect } from 'sequelize/types';

import { env } from '../env';

export const sequelizeConfig: SequelizeOptions = {
  username: env.db.username,
  password: env.db.password,
  database: env.db.name,
  host: env.db.host,
  port: env.db.port,
  dialect: env.db.dialect as Dialect,
};
