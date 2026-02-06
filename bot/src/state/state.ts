import { initArts } from "./arts";
import { getMessage, initMessages } from "./messages";
import { initSheets } from "../table/getSheets";
import { initFaqs } from "./faq";
import { Context, Middleware } from "grammy";
import { initAdmins } from "./admins";
import { initMerchs } from "./merchs";
import { initEvents } from "./events";
import {
  initRegistrations,
  RegistrationStage,
  RegistrationStageResult,
  RegistrationStateItem,
} from "./registrations";

export type State = Awaited<ReturnType<typeof initState>>;

export let state: State;

export interface StateContext extends Context {
  state: State;

  getMessage: (messageKey: string) => string;

  startRegistration?: (eventIndex: string, stages: RegistrationStage[]) => void;
  nextRegistration?: (registrationStageResult: RegistrationStageResult) => void;
  endRegistration?: () => Record<string, string>;
  removeRegistration?: () => void;

  registration?: () => RegistrationStateItem | undefined;
  currentRegistrationStage?: () => RegistrationStage | undefined;
  isEndOfRegistration?: () => boolean;
}

export const addStateMiddleware =
  (): Middleware<StateContext> => async (ctx, next) => {
    ctx.state = state;
    ctx.getMessage = getMessage(state);
    const userId = ctx.from?.id;
    if (userId) {
      ctx.startRegistration = (eventIndex, stages) =>
        state.startRegistration(userId, eventIndex, stages);
      ctx.nextRegistration = (registrationStageResult) =>
        state.nextRegistration(userId, registrationStageResult);
      ctx.endRegistration = () => state.endRegistration(userId);
      ctx.removeRegistration = () => state.removeRegistration(userId);

      ctx.currentRegistrationStage = () =>
        state.getCurrentRegistrationStage(userId);
      ctx.registration = () => state.getRegistration(userId);
      ctx.isEndOfRegistration = () => state.isEndOfRegistration(userId);
    }
    await next();
  };

export async function initState() {
  const sheets = await initSheets();
  const messages = await initMessages(sheets);
  const arts = await initArts(sheets);
  const admins = await initAdmins(sheets);
  const faqs = await initFaqs(sheets);
  const merchs = await initMerchs(sheets);
  const events = await initEvents(sheets);
  const {
    registrations,
    nextRegistration,
    isEndOfRegistration,
    startRegistration,
    endRegistration,
    getRegistration,
    getCurrentRegistrationStage,
    removeRegistration,
  } = initRegistrations();

  return {
    sheets,
    messages,
    faqs,
    admins,
    events,
    arts,
    merchs,

    registrations,
    nextRegistration,
    isEndOfRegistration,
    startRegistration,
    endRegistration,
    getRegistration,
    removeRegistration,
    getCurrentRegistrationStage,
  };
}

export async function reloadState() {
  state = await initState();
}
