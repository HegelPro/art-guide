import { ErrorHandler, GrammyError, HttpError } from "grammy";
import { StateContext } from "../state/state";
import { error } from "console";

export const botErrorHandler: ErrorHandler<StateContext> = async (err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);

  const e = err.error;
  // if (e instanceof GrammyError) {
  //   console.error("Error in request:", e.description);
  // } else if (e instanceof HttpError) {
  //   console.error("Could not contact Telegram:", e);
  // } else
  if (e instanceof Error) {
    console.error("Error", e.message);
    await ctx.state.sheets.spreadsheets.values.append({
      spreadsheetId: (globalThis as any).process.env.GOOGLE_SHEET_ID,
      range: "errors",
      valueInputOption: "RAW",
      requestBody: {
        values: [[e.name, e.message, e.stack, new Date().toISOString()]],
      },
    });
  } else {
    console.error("Unknown error:", e);
  }

  // Отправляем сообщение об ошибке пользователю
  await ctx
    .reply("Произошла ошибка. Пожалуйста, попробуйте позже.")
    .catch(console.error);
};
