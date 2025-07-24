import { initArts } from "./arts";
import { initMessages } from "./messages";
import { initSheets } from "../table/getSheets";
import { initFaqs } from "./faq";
import { Context, Middleware } from "grammy";

export type State = Awaited<ReturnType<typeof initState>>;

export interface StateContext extends Context {
  state: State;
}

export const addStateMiddleware =
  (state: State): Middleware<StateContext> =>
  async (ctx, next) => {
    ctx.state = state;
    await next();
  };

export async function initState() {
  const sheets = await initSheets();
  const messages = await initMessages(sheets);
  const arts = await initArts(sheets);
  const faqs = await initFaqs(sheets);

  return {
    sheets,
    messages,
    arts,
    faqs,
  };
}
