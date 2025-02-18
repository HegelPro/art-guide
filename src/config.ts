import { BotCommand } from "grammy/types";
import { messages } from "./messages";

export const artListCommand: BotCommand = {
  command: 'art_list',
  description: messages.commands.artList.description,
}

export const startCommand: BotCommand = {
  command: 'start',
  description: messages.commands.start.description,
}

export const geoCommand: BotCommand = {
  command: 'geo',
  description: messages.commands.geo.description,
}

interface Art {
  name: string;
  voice?: string;
  audio?: string;
  description?: string;
  shortDescription?: string;
  photo?: string;
  thumbnail?: string;
}

export const arts: Art[] = [
  {
    name: "Картина 1",
    voice: 'voice1.ogg',
    audio: 'picture1.mp3',
    photo:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Banknote_5000_rubles_%281997%29_front.jpg/110px-Banknote_5000_rubles_%281997%29_front.jpg",
    thumbnail:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Banknote_5000_rubles_%281997%29_front.jpg/110px-Banknote_5000_rubles_%281997%29_front.jpg",
  },
  {
    name: "Картина 2",
    voice: 'voice1.ogg',
    audio: 'picture1.mp3',
    photo:
      "https://i1.sndcdn.com/avatars-pQyoSMQZlZyH7VUE-n1BnyQ-large.jpg",
    thumbnail:
      "https://i1.sndcdn.com/avatars-pQyoSMQZlZyH7VUE-n1BnyQ-large.jpg",
  },
  {
    name: "Картина 3",
    voice: 'voice1.ogg',
    audio: 'picture1.mp3',
    photo:
      "https://cs6.pikabu.ru/avatars/1186/v1186809-322096386.jpg",
    thumbnail:
      "https://cs6.pikabu.ru/avatars/1186/v1186809-322096386.jpg",
  },
  {
    name: "Картина 4",
    voice: 'voice1.ogg',
    audio: 'picture1.mp3',
    photo:
      "https://ru-minecraft.ru/uploads/posts/2012-08/1344879606_greenapple_2094636.jpg",
    thumbnail:
      "https://ru-minecraft.ru/uploads/posts/2012-08/1344879606_greenapple_2094636.jpg",
  },
  {
    name: "Картина 5",
    voice: 'voice1.ogg',
    audio: 'picture1.mp3',
  },
  {
    name: "Картина 6",
    voice: 'voice1.ogg',
    audio: 'picture1.mp3',
  },
  {
    name: "Картина 7",
    voice: 'voice1.ogg',
    audio: 'picture1.mp3',
  },
  {
    name: "Картина 8",
    voice: 'voice1.ogg',
    audio: 'picture1.mp3',
  },
  {
    name: "Картина 9",
    voice: 'voice1.ogg',
    audio: 'picture1.mp3',
  },
  {
    name: "Картина 10",
    voice: 'voice1.ogg',
    audio: 'picture1.mp3',
  },
  {
    name: "Картина 11",
    voice: 'voice1.ogg',
    audio: 'picture1.mp3',
  },
  {
    name: "Картина 12",
    voice: 'voice1.ogg',
    audio: 'picture1.mp3',
  },
  {
    name: "Картина 13",
    voice: 'voice1.ogg',
    audio: 'picture1.mp3',
  },
  {
    name: "Картина 14",
    voice: 'voice1.ogg',
    audio: 'picture1.mp3',
  },
  {
    name: "Картина 15",
    voice: 'voice1.ogg',
    audio: 'picture1.mp3',
  },
  {
    name: "Картина 16",
    voice: 'voice1.ogg',
    audio: 'picture1.mp3',
  },
  {
    name: "Картина 17",
    voice: 'voice1.ogg',
    audio: 'picture1.mp3',
  },
];