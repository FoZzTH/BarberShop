import * as dotenv from 'dotenv';

dotenv.config();

export const env = {
  bot: {
    token: process.env.BOT_TOKEN || '',
  },
  app: {
    port: +process.env.PORT || 3000,
    email: {
      login: process.env.EMAIL_LOGIN || '',
      pass: process.env.EMAIL_PASS || '',
    },
  },
  db: {
    dialect: process.env.DB_DIALECT || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    username: process.env.DB_USERNAME || '',
    password: process.env.DB_PASS || '',
    name: process.env.DB_NAME || 'barbershop',
    port: +process.env.DB_PORT || 5432,
  },
};
