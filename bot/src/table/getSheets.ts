import { google } from "googleapis";

const auth = new google.auth.GoogleAuth({
  keyFile: "google_file.json",
  scopes: "https://www.googleapis.com/auth/spreadsheets",
});

export const initSheets = async () => {
  return google.sheets({ version: "v4", auth });
};
