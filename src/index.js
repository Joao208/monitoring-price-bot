require("dotenv/config");

process.env.NTBA_FIX_319 = 1;

const cron = require("node-cron");
const TelegramBot = require("node-telegram-bot-api");
const logger = require("js-logger");
const axios = require("axios");
const cheerio = require("cheerio");
const initMongo = require("./database");
const { Monitoring } = require("./models");

logger.useDefaults();

const token = process.env.TELEGRAM_TOKEN;

const bot = new TelegramBot(token, { polling: true });

initMongo();

const clearPrice = (number, inCents) => {
  if (inCents) return parseFloat(number?.replace(/\D+/g, "")) / 100;

  return number?.replace(/\D+/g, "");
};

const getUrl = (text) => {
  try {
    new URL(text);

    return text;
  } catch {
    return `https://www.buscape.com.br/search?q=${text}`;
  }
};

const deactiveMonitoring = async (ChatId) => {
  await Monitoring.findOneAndUpdate({ ChatId }, { active: false });
};

const addIgnoreTitle = async (ChatId) => {
  const monitoring = await Monitoring.findOne({ ChatId });

  monitoring.TitlesToIgnore.push(monitoring?.LastTitle);

  await monitoring.save();
};

const sendMessageWithPrice = async (ChatId, url) => {
  await bot.sendMessage(
    ChatId,
    `Ei! O preço chegou onde você queria, corre nesse link: ${url}, acertei no produto?`,
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Sim",
              callback_data: "yes",
            },
            {
              text: "Não",
              callback_data: "no",
            },
          ],
        ],
      },
    }
  );
};

const verifyPrice = async (text, monitoring) => {
  const response = await axios.get(getUrl(text));

  const $ = cheerio.load(response?.data);

  const prices = [];

  $(".Hits_SearchResultListItem__1w6j-")
    .get()
    .map((item) => {
      const href = $(item).find(".Cell_Content__1630r").attr("href");
      const title = $(item).find(".Text_LabelSmRegular__2Lr6I").text();

      const url = `https://www.buscape.com.br${href}`;

      const value = $(item).find(".Text_LabelMdBold__3KBIj");

      prices.push({ title, value: value.text(), url });
    });

  for (const { value, url, title } of prices) {
    if (monitoring?.TitlesToIgnore.includes(title)) continue;

    const valueFormated = clearPrice(value, true);

    if (valueFormated && valueFormated <= monitoring?.InterestPrice) {
      monitoring.LastTitle = title;

      monitoring.save();

      return sendMessageWithPrice(monitoring?.ChatId, url);
    }
  }
};

const getAllMonitorings = async () => {
  const monitorings = await Monitoring.find({ active: true, answered: true });

  for (const monitoring of monitorings) {
    verifyPrice(monitoring?.product || monitoring?.url, monitoring);
  }
};

cron.schedule("* * * * *", getAllMonitorings);

const isEqual = (a, b) => {
  return a?.reply_to_message?.text == b;
};

const formatPrice = (number) => {
  return parseFloat(clearPrice(number))?.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

const saveUrl = async (url, ChatId) => {
  await Monitoring.findOneAndUpdate({ ChatId }, { url });
};

const saveProductOrUrl = async (text, ChatId) => {
  try {
    new URL(text);

    saveUrl(text, ChatId);
  } catch {
    await Monitoring.findOneAndUpdate({ ChatId }, { product: text });
  }
};

const savePrice = async (price, ChatId) => {
  await Monitoring.findOneAndUpdate(
    { ChatId },
    { InterestPrice: clearPrice(price) }
  );
};

bot.on("callback_query", async (msg) => {
  const ChatId = msg.from.id;

  await Monitoring.findOneAndUpdate({ ChatId }, { answered: true });

  if (msg.data === "no") {
    addIgnoreTitle(ChatId);

    bot.sendMessage(ChatId, `Ok! Vou continuar de olho então...`);
  } else if (msg.data === "yes") {
    bot.sendMessage(
      ChatId,
      `Agora vou parar por aqui 😕, mas pode me mandar um novo produto sempre que quiser 😁`
    );

    deactiveMonitoring(ChatId);
  }
});

bot.on("message", async (msg) => {
  if (/\/start/.test(msg.text)) return;

  if (!("reply_to_message" in msg)) {
    saveProductOrUrl(msg.text, msg.chat.id);

    await bot.sendMessage(
      msg.chat.id,
      "Legal! Vou monitorar para você, qual o valor deseja pagar?"
    );

    bot.sendMessage(
      msg.chat.id,
      "Não esqueça de responder a mensagem acima, senão não consigo rastrar pra você 😅"
    );
  }

  if (
    isEqual(msg, `Legal! Vou monitorar para você, qual o valor deseja pagar?`)
  ) {
    savePrice(msg.text, msg.chat.id);

    return bot.sendMessage(
      msg.chat.id,
      `Estou de 👀, te aviso assim que chegar a ${formatPrice(msg.text)}`
    );
  }
});

bot.onText(/\/start/, async (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "Olá, eu sou o Senhor Preço Baixo, para que eu possa ajuda-lo a monitorar seu produto favorito basta me enviar um link do buscape.com.br de um produto ou o nome de um"
  );

  const monitoringChat = await Monitoring.findOne({ ChatId: msg.chat.id });

  if (!monitoringChat) await Monitoring.create({ ChatId: msg.chat.id });
});
