import { TelegrafContext } from 'telegraf/typings/context';
import { SceneContextMessageUpdate } from 'telegraf/typings/stage';
import { ICommandArgs } from 'src/interfaces/commandArgs.interface';

export function getArgs(
  ctx: TelegrafContext | SceneContextMessageUpdate,
): ICommandArgs {
  const regex = /^\/([^\s]+)\s?(.+)?/;
  const parts = regex.exec(ctx.message.text.trim());

  return {
    raw: parts[0],
    command: parts[1],
    args: parts[2],
    splitArgs: parts[2] ? parts[2].split(/ +/) : [],
  };
}
