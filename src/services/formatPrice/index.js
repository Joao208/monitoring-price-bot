const logger = require("js-logger");
const clearPrice = require("../clearPrice");

const errorHandler = require("../errorHandler");

const formatPrice = (number) => {
  try {
    logger.info(`[formatPrice] Formating: ${number}`);

    return parseFloat(clearPrice(number))?.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  } catch (error) {
    errorHandler({ error, params: number, functionName: "formatPrice" });
  }
};

module.exports = formatPrice;
