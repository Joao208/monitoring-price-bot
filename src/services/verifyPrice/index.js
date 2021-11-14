const axios = require("axios");
const cheerio = require("cheerio");
const logger = require("js-logger");

const clearPrice = require("../clearPrice");
const errorHandler = require("../errorHandler");
const getUrl = require("../getUrl");
const sendMessageWithPrice = require("../sendMessageWithPrice");
const scrapperWithProduct = require("./scrapperWithProduct");
const scrapperWithUrl = require("./scrapperWithUrl");

const verifyPrice = async (url, monitoring, bot, isUrl) => {
  try {
    logger.info("[verifyPrice] Verify if price is minor or equal");

    const response = await axios.get(getUrl(url));

    const $ = cheerio.load(response?.data);

    const prices = isUrl
      ? await scrapperWithUrl($, url)
      : await scrapperWithProduct($);

    for (const { value, url, title } of prices) {
      if (monitoring?.TitlesToIgnore.includes(title)) continue;

      const valueFormated = clearPrice(value, !isUrl);

      console.log(valueFormated);

      if (valueFormated && valueFormated <= monitoring?.InterestPrice) {
        monitoring.LastTitle = title;

        monitoring.save();

        return sendMessageWithPrice(monitoring?.ChatId, url, bot);
      }
    }
  } catch (error) {
    errorHandler({
      error,
      bot,
      params: (url, monitoring, isUrl),
      functionName: "verifyPrice",
    });
  }
};

module.exports = verifyPrice;
