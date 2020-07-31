import { env } from '../env';

export const dbConfig = {
  user: env.db.username,
  host: env.db.host,
  database: env.db.name,
  password: env.db.password,
  port: env.db.port,
};
