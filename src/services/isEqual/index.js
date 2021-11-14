const logger = require("js-logger");

const errorHandler = require("../errorHandler");

const isEqual = (a, b) => {
  try {
    logger.info("[isEqual] Check if message is equal to other");

    return a?.reply_to_message?.text == b;
  } catch (error) {
    errorHandler({ error, params: (a, b), functionName: "isEqual" });
  }
};

module.exports = isEqual;
