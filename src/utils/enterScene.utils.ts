import { SceneContextMessageUpdate } from 'telegraf/typings/stage';
import { bot } from 'src/bot';

export function enterSceneCommand(command: string) {
  bot.command(command, (ctx: SceneContextMessageUpdate) => {
    ctx.scene.enter(command);
  });
}
