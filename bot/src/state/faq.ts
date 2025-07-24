import { sheets_v4 } from "googleapis";

export async function initFaqs(sheets: sheets_v4.Sheets) {
  const values = await sheets.spreadsheets.values.get({
    spreadsheetId: (globalThis as any).process.env.GOOGLE_SHEET_ID,
    range: "faq",
  });
  return values.data.values?.map((row) => row) || [];
}
