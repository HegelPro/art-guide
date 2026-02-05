import { initArts } from "./arts";
import { getMessage, initMessages } from "./messages";
import { initSheets } from "../table/getSheets";
import { initFaqs } from "./faq";
import { Context, Middleware } from "grammy";
import { initAdmins } from "./admins";
import { initMerchs } from "./merchs";

export type State = Awaited<ReturnType<typeof initState>>;

export let state: State;

export interface StateContext extends Context {
  state: State;
  getMessage: (messageKey: string) => string;
}

export const addStateMiddleware =
  (): Middleware<StateContext> => async (ctx, next) => {
    Object.defineProperty(ctx, "state", {
      get: function () {
        return state;
      },
      set: function (val) {
        this._value = val;
      },
    });
    ctx.state = state;
    ctx.getMessage = getMessage(state);
    await next();
  };

export async function initState() {
  const sheets = await initSheets();
  const messages = await initMessages(sheets);
  const arts = await initArts(sheets);
  const admins = await initAdmins(sheets);
  const faqs = await initFaqs(sheets);
  const merchs = await initMerchs(sheets);

  return {
    sheets,
    messages,
    arts,
    admins,
    faqs,
    merchs,
  };
}

export async function reloadState() {
  state = await initState();
}
