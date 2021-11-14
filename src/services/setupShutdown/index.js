const logger = require("js-logger");

const setupShutdown = (bot) => {
  bot.stopPolling();

  logger.info("[setupShutdown] Stopping bot");
};

module.exports = setupShutdown;
