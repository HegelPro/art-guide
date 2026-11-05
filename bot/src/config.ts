import "dotenv/config";

function requiredEnv(name: "BOT_TOKEN" | "GOOGLE_SHEET_ID"): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} is required`);
  }
  return value;
}

export const config = {
  botToken: requiredEnv("BOT_TOKEN"),
  googleSheetId: requiredEnv("GOOGLE_SHEET_ID"),
  proxyUrl: process.env.PROXY_URL?.trim(),
};
