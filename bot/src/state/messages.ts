import { sheets_v4 } from "googleapis";

export type Messages = Record<string, string>;

export async function initMessages(sheets: sheets_v4.Sheets) {
  const values = await sheets.spreadsheets.values.get({
    spreadsheetId: (globalThis as any).process.env.GOOGLE_SHEET_ID,
    range: "messages",
    valueRenderOption: 'UNFORMATTED_VALUE'
  });

  const messages: Messages = {
    // 'commands.start.description' : "Начать работу с ботом",
    // 'commands.start.message' : 'Добро пожаловать в аудиогид бот для выставки Олеси Степановой "После тёмной ночи наступает солнце"',
    // 'commands.artList.description' : "Покзать список работ",
    // 'commands.artList.message' : `Посмотреть список работ можно ниже`,
    // 'commands.geo.description' : "Как добраться до искры?",
    // 'commands.geo.message' : `Посмотреть список работ можно ниже`,
    // 'commands.faq.description' : "Часто задаваемые вопросы:",
    // 'commands.faq.message' : "Список часто задаваемых вопросов",
    // 'commands.qr.description' : "Куда донатить?",
    // 'buttons.inlineShowArt': "Посмотреть работы художника",
    // 'faq.answer': 'Ответ на ваш вопрос:\n',
  };

  values.data.values?.forEach((row) => {
    console.log(row);
    messages[row[0]] = row[1];
  });

  return messages;
}
