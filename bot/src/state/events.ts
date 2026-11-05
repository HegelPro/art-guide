import { sheets_v4 } from "googleapis";
import { config } from "../config";

interface IscraEvent {
  name: string;
  description?: string;
  shortDescription?: string;
  photo?: string;
  thumbnail?: string;
}

export type IscraEvents = IscraEvent[];

export async function initEvents(sheets: sheets_v4.Sheets) {
  const values = await sheets.spreadsheets.values.get({
    spreadsheetId: config.googleSheetId,
    range: "events",
  });
  return (values.data.values ?? []).slice(1).map((row) => ({
      name: row[0],
      description: row[1],
      shortDescription: row[2],
      photo: row[3],
      thumbnail: row[4],
    }));
}
