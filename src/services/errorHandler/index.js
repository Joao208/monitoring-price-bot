const logger = require("js-logger");

const errorHandler = ({ error, bot, params, functionName }) => {
  logger.error(`[${functionName}] params: ${params}`, error);

  bot?.sendMessage(
    650687555,
    `Hei João, uma de minhas funções quebraram, foi a ${functionName}`
  );
};

module.exports = errorHandler;
