const logger = require("js-logger");
const { Monitoring } = require("../../models");

const errorHandler = require("../errorHandler");

const sendMessageWithPrice = async (ChatId, url, bot) => {
  try {
    logger.info(
      "[sendMessageWithPrice] Send message to user, with url of product"
    );

    const monitoring = await Monitoring.findOne({ ChatId });

    await bot.sendMessage(
      ChatId,
      `Ei! O preço chegou onde você queria, corre nesse link: ${url}, acertei no produto?`,
      {
        ...(!monitoring?.url && {
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
        }),
      }
    );

    await Monitoring.findOneAndUpdate({ ChatId }, { answered: false });
  } catch (error) {
    errorHandler({
      error,
      bot,
      params: (ChatId, url),
      functionName: "sendMessageWithPrice",
    });
  }
};

module.exports = sendMessageWithPrice;
