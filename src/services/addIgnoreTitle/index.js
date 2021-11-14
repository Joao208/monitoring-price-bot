const logger = require("js-logger");

const { Monitoring } = require("../../models");
const errorHandler = require("../errorHandler");

const addIgnoreTitle = async (ChatId) => {
  try {
    logger.info(`[addIgnoreTitle] Ignoring new title, params: ${ChatId}`);

    const monitoring = await Monitoring.findOne({ ChatId });

    monitoring.TitlesToIgnore.push(monitoring?.LastTitle);

    await monitoring.save();
  } catch (error) {
    errorHandler({
      error,
      params: ChatId,
      functionName: "addIgnoreTitle",
    });
  }
};

module.exports = addIgnoreTitle;
