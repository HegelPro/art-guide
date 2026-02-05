import { commandLogger } from "../../utils/commandLogger";
import { reloadState } from "../../state/state";

export const reloadCommand = "reload";

export const reloadCommandMiddleware = commandLogger(async (ctx) => {
  if (ctx.state.admins.some((admin) => admin.id === ctx.from?.id.toString())) {
    await reloadState();
    ctx.reply("Состояние обновлено");
  } else {
    ctx.reply("У вас нет доступа к данной команде");
  }
});
