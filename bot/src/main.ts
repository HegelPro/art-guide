import "dotenv/config";

import { startCommand, startCommandMiddleware } from "./features/start";
import { addStateMiddleware, reloadState, state } from "./state/state";
import { botErrorHandler } from "./utils/errorHandler";
import { getMessage } from "./state/messages";
import { bot } from "./bot";
import { reloadCommand, reloadCommandMiddleware } from "./features/reload";
import { setCallbackQueries } from "./setCallbackQueries";
import { setInlineQueryMiddleware } from "./setInlineQueryMiddleware";
import { setMessageMiddleware } from "./setMessageMiddleware";

bot.catch(botErrorHandler);

async function start() {
  // Обновляем состояние перед стартом приложения
  await reloadState();

  bot.use(addStateMiddleware());

  await setCallbackQueries(bot);

  // commands
  bot.command(startCommand, startCommandMiddleware);
  bot.command(reloadCommand, reloadCommandMiddleware);

  bot.api.setMyCommands([
    {
      command: startCommand,
      description: getMessage(state)("commands.start.description"),
    },
  ]);

  await setMessageMiddleware(bot);

  await setInlineQueryMiddleware(bot);

  bot.start();
}

start();
