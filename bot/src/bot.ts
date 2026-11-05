import { Bot } from "grammy";
import { HttpsProxyAgent } from "https-proxy-agent";
import { SocksProxyAgent } from "socks-proxy-agent";
import { StateContext } from "./state/state";
import { config } from "./config";

// PROXY_URL может быть как http(s)-, так и socks-прокси
function createProxyAgent(url: string) {
  return url.startsWith("socks") ? new SocksProxyAgent(url) : new HttpsProxyAgent(url);
}

export const bot = new Bot<StateContext>(
  config.botToken,
  config.proxyUrl
    ? { client: { baseFetchConfig: { agent: createProxyAgent(config.proxyUrl) } } }
    : undefined
);
