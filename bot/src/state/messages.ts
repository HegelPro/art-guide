import { sheets_v4 } from "googleapis";
import { State } from "./state";

export type Messages = Record<string, string>;

export async function initMessages(sheets: sheets_v4.Sheets) {
  const values = await sheets.spreadsheets.values.get({
    spreadsheetId: (globalThis as any).process.env.GOOGLE_SHEET_ID,
    range: "messages",
    // valueRenderOption: "UNFORMATTED_VALUE",
    prettyPrint: true,
  });

  const messages: Messages = {};

  values.data.values?.shift();
  values.data.values?.forEach((row) => {
    console.log(row);
    messages[row[0]] = row[1];
  });

  return messages;
}

export const getMessage = (state: State) => (messageKey: string) =>
  state.messages[messageKey] || messageKey;
