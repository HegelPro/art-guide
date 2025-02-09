"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const grammy_1 = require("grammy");
const path = __importStar(require("path"));
const types_1 = require("grammy/types");
require("dotenv/config");
const bot = new grammy_1.Bot(globalThis.process.env.BOT_TOKEN);
const arts = [
    {
        name: "Картина 1",
        audio: 'picture1.mp3',
        photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Banknote_5000_rubles_%281997%29_front.jpg/110px-Banknote_5000_rubles_%281997%29_front.jpg",
        thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Banknote_5000_rubles_%281997%29_front.jpg/110px-Banknote_5000_rubles_%281997%29_front.jpg",
    },
    {
        name: "Картина 2",
        audio: 'picture1.mp3',
        photo: "https://i1.sndcdn.com/avatars-pQyoSMQZlZyH7VUE-n1BnyQ-large.jpg",
        thumbnail: "https://i1.sndcdn.com/avatars-pQyoSMQZlZyH7VUE-n1BnyQ-large.jpg",
    },
    {
        name: "Картина 3",
        audio: 'picture1.mp3',
        photo: "https://cs6.pikabu.ru/avatars/1186/v1186809-322096386.jpg",
        thumbnail: "https://cs6.pikabu.ru/avatars/1186/v1186809-322096386.jpg",
    },
    {
        name: "Картина 4",
        audio: 'picture1.mp3',
        photo: "https://ru-minecraft.ru/uploads/posts/2012-08/1344879606_greenapple_2094636.jpg",
        thumbnail: "https://ru-minecraft.ru/uploads/posts/2012-08/1344879606_greenapple_2094636.jpg",
    },
];
bot.command("start", (ctx) => ctx.reply(`Добро пожаловать в бот для выставки "Название выставки"`, {
    reply_markup: new grammy_1.InlineKeyboard().switchInlineCurrent("Посмотреть работы художника", ''),
}));
bot.command("art_list", (ctx) => ctx.reply(`Посмотреть список работ можно ниже`, {
    reply_markup: new grammy_1.InlineKeyboard().switchInlineCurrent("Посмотреть работы художника", ''),
}));
bot.api.setMyCommands([
    {
        command: 'art_list',
        description: 'Покзать список работ'
    }
]);
bot.on("message", (ctx) => {
    const art = arts.find((art) => art.name === ctx.message.caption);
    // console.log(ctx.message);
    if (art) {
        const audioFile = new types_1.InputFile(path.join(__dirname, 'assets', art.audio));
        ctx.replyWithAudio(audioFile, {
            title: art.name,
            performer: art.name,
            caption: art.name,
        });
        // ctx.reply(`Голосовое сообщение для картины ${art.name}`);
    }
});
bot.on("inline_query", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    // const query = ctx.inlineQuery.query; // Текст, который ввел пользователь
    const results = arts.map((art, index) => ({
        type: "photo",
        id: index.toString(), // Уникальный ID для результата
        show_caption_above_media: true,
        caption: art.name,
        photo_url: art.photo,
        thumbnail_url: art.thumbnail,
    }));
    console.log(results);
    yield ctx.answerInlineQuery(results, {
        cache_time: 0, // Не кэшировать результаты
    });
}));
// Start the bot.
bot.start();
