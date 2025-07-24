import { ErrorHandler, GrammyError, HttpError } from "grammy";
import { StateContext } from "../state/state";

export const botErrorHandler: ErrorHandler<StateContext> = (err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);

  const e = err.error;
  if (e instanceof GrammyError) {
    console.error("Error in request:", e.description);
  } else if (e instanceof HttpError) {
    console.error("Could not contact Telegram:", e);
  } else {
    console.error("Unknown error:", e);
  }

  // Отправляем сообщение об ошибке пользователю
  ctx
    .reply("Произошла ошибка. Пожалуйста, попробуйте позже.")
    .catch(console.error);
};
