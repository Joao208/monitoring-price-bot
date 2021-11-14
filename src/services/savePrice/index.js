const logger = require("js-logger");

const { Monitoring } = require("../../models");
const clearPrice = require("../clearPrice");
const errorHandler = require("../errorHandler");

const savePrice = async (price, ChatId) => {
  try {
    logger.info("[savePrice] Saving price interested");

    await Monitoring.findOneAndUpdate(
      { ChatId },
      { InterestPrice: clearPrice(price) }
    );
  } catch (error) {
    errorHandler({ error, params: (price, ChatId), functionName: "savePrice" });
  }
};

module.exports = savePrice;
