import { BotCommand } from "grammy/types";
import { Messages } from "../state/messages";
import { commandLogger } from "../utils/commandLogger";

export const googleTableCommand = (messages: Messages): BotCommand => ({
  command: "google",
  description: messages["commands.start.description"],
});

export const googleTableMiddleware = commandLogger(async (ctx) => {
  // const sheets = await getSheets();
  const values = await ctx.state.sheets.spreadsheets.values.get({
    spreadsheetId: (globalThis as any).process.env.GOOGLE_SHEET_ID,
    range: "events",
  });
  await ctx.reply(
    values.data.values?.map((values) => values.join("|")).join("\n") ||
      "nothing",
    {
      // parse_mode: "HTML",
    }
  );
});
