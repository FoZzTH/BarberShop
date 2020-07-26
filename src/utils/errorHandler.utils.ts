import { TelegrafContext } from 'telegraf/typings/context';

export function errorHandler(err: Error, ctx: TelegrafContext) {
  console.log('Error:', {
    name: err.name,
    message: err.message,
  });
}
