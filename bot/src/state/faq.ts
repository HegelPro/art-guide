import { sheets_v4 } from "googleapis";
import { config } from "../config";

export async function initFaqs(sheets: sheets_v4.Sheets) {
  const values = await sheets.spreadsheets.values.get({
    spreadsheetId: config.googleSheetId,
    range: "faq",
  });
  return (values.data.values ?? []).slice(1);
}
