import { Bot } from "grammy";
import { HttpsProxyAgent } from "https-proxy-agent";
import { SocksProxyAgent } from "socks-proxy-agent";
import { StateContext } from "./state/state";

const proxyUrl = (globalThis as any).process.env.PROXY_URL;

// PROXY_URL может быть как http(s)-, так и socks-прокси
function createProxyAgent(url: string) {
  return url.startsWith("socks") ? new SocksProxyAgent(url) : new HttpsProxyAgent(url);
}

export const bot = new Bot<StateContext>(
  (globalThis as any).process.env.BOT_TOKEN,
  proxyUrl
    ? { client: { baseFetchConfig: { agent: createProxyAgent(proxyUrl) } } }
    : undefined
);
