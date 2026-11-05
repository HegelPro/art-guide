import { sheets_v4 } from "googleapis";
import { config } from "../config";

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
    spreadsheetId: config.googleSheetId,
    range: "actions",
    valueInputOption: "RAW",
    requestBody: {
      values: [[actionType, details, userId, userName, date]],
    },
  });
