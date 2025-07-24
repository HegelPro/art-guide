import { sheets_v4 } from "googleapis";

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

export const arts: Arts = [];

export async function initArts(sheets: sheets_v4.Sheets) {
  // callbackQuery
  const values = await sheets.spreadsheets.values.get({
    spreadsheetId: (globalThis as any).process.env.GOOGLE_SHEET_ID,
    range: "arts",
  });
  values.data.values?.forEach((row) => {
    arts.push({
      name: row[0],
      description: row[1],
      audio: row[2],
      photo: row[3],
      thumbnail: row[4],
    });
  });
  console.log(arts)
  return arts;
}
