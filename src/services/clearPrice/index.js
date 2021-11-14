const logger = require("js-logger");
const errorHandler = require("../errorHandler");

const clearPrice = (number, inCents) => {
  try {
    logger.info(`[clearPrice] params: ${(number, inCents)}`);

    if (inCents) return parseFloat(number?.replace(/\D+/g, "")) / 100;

    return number?.replace(/\D+/g, "");
  } catch (error) {
    errorHandler({
      error,
      params: (number, inCents),
      functionName: "clearPrice",
    });
  }
};

module.exports = clearPrice;
