require("dotenv/config");

process.env.NTBA_FIX_319 = 1;

const cron = require("node-cron");
const TelegramBot = require("node-telegram-bot-api");
const logger = require("js-logger");

const initMongo = require("./database");
const { Monitoring } = require("./models");
const {
  getAllMonitorings,
  findOrCreateMonitoring,
  saveProductOrUrl,
  isEqual,
  savePrice,
  deactiveMonitoring,
} = require("./services");
const {
  continueMonitoring,
  stopMonitoring,
  yourInterestValue,
  dontForgot,
  imVerify,
  hello,
} = require("./constants/texts");

logger.useDefaults();

const token = process.env.TELEGRAM_TOKEN;

const bot = new TelegramBot(token, { polling: true });

initMongo();

cron.schedule("* * * * *", () => getAllMonitorings(bot));

bot.on("callback_query", async (msg) => {
  const ChatId = msg.from.id;

  await Monitoring.findOneAndUpdate({ ChatId }, { answered: true });

  if (msg.data === "no") {
    addIgnoreTitle(ChatId);

    bot.sendMessage(ChatId, continueMonitoring);
  } else if (msg.data === "yes") {
    bot.sendMessage(ChatId, stopMonitoring);

    deactiveMonitoring(ChatId);
  }
});

bot.on("message", async (msg) => {
  if (/\/start/.test(msg.text)) return;

  if (!("reply_to_message" in msg)) {
    saveProductOrUrl(msg.text, msg.chat.id);

    await bot.sendMessage(msg.chat.id, yourInterestValue);

    findOrCreateMonitoring(msg.chat.id);

    bot.sendMessage(msg.chat.id, dontForgot);
  }

  if (isEqual(msg, yourInterestValue)) {
    savePrice(msg.text, msg.chat.id);

    return bot.sendMessage(msg.chat.id, imVerify(msg.text));
  }
});

bot.onText(/\/start/, async (msg) => {
  bot.sendMessage(msg.chat.id, hello);

  findOrCreateMonitoring(msg.chat.id);
});
