import { Bot, InlineKeyboard, Keyboard } from "grammy";
import * as path from "path";
import { InlineQueryResult, InputFile } from "grammy/types";
import "dotenv/config";

const bot = new Bot((globalThis as any).process.env.BOT_TOKEN);

const arts = [
  {
    name: "Картина 1",
    audio: 'picture1.mp3',
    photo:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Banknote_5000_rubles_%281997%29_front.jpg/110px-Banknote_5000_rubles_%281997%29_front.jpg",
    thumbnail:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Banknote_5000_rubles_%281997%29_front.jpg/110px-Banknote_5000_rubles_%281997%29_front.jpg",
  },
  {
    name: "Картина 2",
    audio: 'picture1.mp3',
    photo:
      "https://i1.sndcdn.com/avatars-pQyoSMQZlZyH7VUE-n1BnyQ-large.jpg",
    thumbnail:
      "https://i1.sndcdn.com/avatars-pQyoSMQZlZyH7VUE-n1BnyQ-large.jpg",
  },
  {
    name: "Картина 3",
    audio: 'picture1.mp3',
    photo:
      "https://cs6.pikabu.ru/avatars/1186/v1186809-322096386.jpg",
    thumbnail:
      "https://cs6.pikabu.ru/avatars/1186/v1186809-322096386.jpg",
  },
  {
    name: "Картина 4",
    audio: 'picture1.mp3',
    photo:
      "https://ru-minecraft.ru/uploads/posts/2012-08/1344879606_greenapple_2094636.jpg",
    thumbnail:
      "https://ru-minecraft.ru/uploads/posts/2012-08/1344879606_greenapple_2094636.jpg",
  },
];

bot.command("start", (ctx) =>
  ctx.reply(`Добро пожаловать в бот для выставки "Название выставки"`, {
    reply_markup: new InlineKeyboard().switchInlineCurrent(
      "Посмотреть работы художника",
      ''
    ),
  })
);

bot.command("art_list", (ctx) =>
  ctx.reply(`Посмотреть список работ можно ниже`, {
    reply_markup: new InlineKeyboard().switchInlineCurrent(
      "Посмотреть работы художника",
      ''
    ),
  })
);

bot.api.setMyCommands([
  {
    command: 'art_list',
    description: 'Покзать список работ'
  }
])

bot.on("message", (ctx) => {
  const art = arts.find((art) => art.name === ctx.message.caption);
  // console.log(ctx.message);
  if (art) {
    const audioFile = new InputFile(path.join(__dirname, 'assets', art.audio));
    ctx.replyWithAudio(audioFile, {
      title: art.name,
      performer: art.name,
      caption: art.name,
    });
    // ctx.reply(`Голосовое сообщение для картины ${art.name}`);
  }
});

bot.on("inline_query", async (ctx) => {
  // const query = ctx.inlineQuery.query; // Текст, который ввел пользователь
  const results: InlineQueryResult[] = arts.map((art, index) => ({
    type: "photo",
    id: index.toString(), // Уникальный ID для результата
    show_caption_above_media: true,
    caption: art.name,
    photo_url: art.photo,
    thumbnail_url: art.thumbnail,
  }));

  console.log(results)

  await ctx.answerInlineQuery(results, {
    cache_time: 0, // Не кэшировать результаты
  });
});

// Start the bot.
bot.start();
