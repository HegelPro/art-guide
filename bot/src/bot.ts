import { Bot } from "grammy";
import { StateContext } from "./state/state";

export const bot = new Bot<StateContext>(
  (globalThis as any).process.env.BOT_TOKEN
);
