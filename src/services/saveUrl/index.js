const logger = require("js-logger");

const { Monitoring } = require("../../models");
const errorHandler = require("../errorHandler");

const saveUrl = async (url, ChatId) => {
  try {
    logger.info("[saveUrl] Saving url of product");

    await Monitoring.findOneAndUpdate(
      { ChatId },
      { url, active: true, product: "", InterestPrice: 0, answered: true }
    );
  } catch (error) {
    errorHandler({ error, params: (url, ChatId), functionName: "saveUrl" });
  }
};

module.exports = saveUrl;
