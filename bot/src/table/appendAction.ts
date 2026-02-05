import { sheets_v4 } from "googleapis";

export const appendAction = async (
  sheets: sheets_v4.Sheets,
  {
    actionType,
    details,
    userId,
    userName,
    date,
  }: {
    actionType: string;
    details?: string;
    userId?: string | number;
    userName?: string;
    date?: number | string;
  }
) =>
  await sheets.spreadsheets.values.append({
    spreadsheetId: (globalThis as any).process.env.GOOGLE_SHEET_ID,
    range: "actions",
    valueInputOption: "RAW",
    requestBody: {
      values: [
        [
          actionType,
          details,
          userId,
          userName,
          date,
        ],
      ],
    },
  });
