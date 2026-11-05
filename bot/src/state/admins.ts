import { sheets_v4 } from "googleapis";
import { config } from "../config";

interface Admin {
  id: string;
}

export type Admins = Admin[];

export async function initAdmins(sheets: sheets_v4.Sheets) {
  const values = await sheets.spreadsheets.values.get({
    spreadsheetId: config.googleSheetId,
    range: "admins",
  });
  return (values.data.values ?? []).slice(1).map((row) => ({ id: row[0] }));
}
