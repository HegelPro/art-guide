import { Bot } from "grammy";
import {
  editMainCallbackQuery,
  editMainCommand,
  pushMainCallbackQuery,
  pushMainCommand,
  pushMainWithRemoveRegistrationCallbackQuery,
  pushMainWithRemoveRegistrationCommand,
} from "./features/main";
import { StateContext } from "./state/state";
import { startCallbackQuery, startCommand } from "./features/start";
import { registerCallbackQuery, registerCommand } from "./features/register";
import { geoCallbackQuery, geoCommand } from "./features/geo";
import { scheduleCallbackQuery, scheduleCommand } from "./features/schedule";
import { donateCallbackQuery, donateCommand } from "./features/donate";
import { homeCallbackQuery, homeCommand } from "./features/home";

export const setCallbackQueries = async (bot: Bot<StateContext>) => {
  bot.callbackQuery(
    pushMainWithRemoveRegistrationCommand,
    pushMainWithRemoveRegistrationCallbackQuery,
  );
  bot.callbackQuery(pushMainCommand, pushMainCallbackQuery);
  bot.callbackQuery(editMainCommand, editMainCallbackQuery);
  bot.callbackQuery(startCommand, startCallbackQuery);
  bot.callbackQuery(registerCommand, registerCallbackQuery);
  bot.callbackQuery(geoCommand, geoCallbackQuery);
  bot.callbackQuery(scheduleCommand, scheduleCallbackQuery);
  bot.callbackQuery(donateCommand, donateCallbackQuery);
  bot.callbackQuery(homeCommand, homeCallbackQuery);
};
