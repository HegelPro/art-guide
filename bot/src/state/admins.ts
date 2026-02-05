import { sheets_v4 } from "googleapis";

interface Admin {
  id: string;
}

export type Admins = Admin[];

export const admins: Admins = [];

export async function initAdmins(sheets: sheets_v4.Sheets) {
  // callbackQuery
  const values = await sheets.spreadsheets.values.get({
    spreadsheetId: (globalThis as any).process.env.GOOGLE_SHEET_ID,
    range: "admins",
  });
  values.data.values?.shift();
  values.data.values?.forEach((row) => {
    admins.push({
      id: row[0],
    });
  });
  // console.log(admins);
  return admins;
}
