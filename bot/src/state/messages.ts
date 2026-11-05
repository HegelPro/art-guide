import { sheets_v4 } from "googleapis";
import { State } from "./state";
import { config } from "../config";

export type Messages = Record<string, string>;

export async function initMessages(sheets: sheets_v4.Sheets) {
  const values = await sheets.spreadsheets.values.get({
    spreadsheetId: config.googleSheetId,
    range: "messages",
  });

  const messages: Messages = {};

  (values.data.values ?? []).slice(1).forEach((row) => {
    if (row[0]) messages[row[0]] = row[1] ?? "";
  });

  return messages;
}

export const getMessage = (state: State) => (messageKey: string) =>
  state.messages[messageKey] || messageKey;
