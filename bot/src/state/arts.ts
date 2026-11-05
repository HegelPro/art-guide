import { sheets_v4 } from "googleapis";
import { config } from "../config";

interface Art {
  name: string;
  voice?: string;
  audio?: string;
  description?: string;
  shortDescription?: string;
  photo?: string;
  thumbnail?: string;
}

export type Arts = Art[];

export async function initArts(sheets: sheets_v4.Sheets) {
  const values = await sheets.spreadsheets.values.get({
    spreadsheetId: config.googleSheetId,
    range: "arts",
  });
  return (values.data.values ?? []).slice(1).map((row) => ({
      name: row[0],
      description: row[1],
      shortDescription: row[2],
      audio: row[3],
      photo: row[4],
      thumbnail: row[5],
    }));
}
