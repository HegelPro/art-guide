import { ErrorHandler } from "grammy";
import { StateContext } from "../state/state";
import { config } from "../config";

export const botErrorHandler: ErrorHandler<StateContext> = async (err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);

  const e = err.error;
  if (e instanceof Error) {
    console.error("Error", e.message);
    await ctx.state?.sheets.spreadsheets.values.append({
      spreadsheetId: config.googleSheetId,
      range: "errors",
      valueInputOption: "RAW",
      requestBody: {
        values: [[e.name, e.message, e.stack, new Date().toISOString()]],
      },
    }).catch((logError: unknown) => console.error("Failed to log error:", logError));
  } else {
    console.error("Unknown error:", e);
  }

  // Отправляем сообщение об ошибке пользователю
  await ctx
    .reply("Произошла ошибка. Пожалуйста, попробуйте позже.")
    .catch(console.error);
};
