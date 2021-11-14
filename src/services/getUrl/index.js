const logger = require("js-logger");

const getUrl = (text) => {
  try {
    logger.info(`[getUrl] params: ${text}`);

    new URL(text);

    return text;
  } catch (error) {
    return `https://www.buscape.com.br/search?q=${text}`;
  }
};

module.exports = getUrl;
