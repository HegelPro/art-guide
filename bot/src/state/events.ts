import { sheets_v4 } from "googleapis";

interface IscraEvent {
  name: string;
  description?: string;
  shortDescription?: string;
  photo?: string;
  thumbnail?: string;
}

export type IscraEvents = IscraEvent[];

export const events: IscraEvents = [];

export async function initEvents(sheets: sheets_v4.Sheets) {
  // callbackQuery
  const values = await sheets.spreadsheets.values.get({
    spreadsheetId: (globalThis as any).process.env.GOOGLE_SHEET_ID,
    range: "events",
  });
  values.data.values?.shift();
  values.data.values?.forEach((row) => {
    events.push({
      name: row[0],
      description: row[1],
      shortDescription: row[2],
      photo: row[3],
      thumbnail: row[4],
    });
  });
  // console.log(arts);
  return events;
}
