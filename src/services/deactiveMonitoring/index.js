const logger = require("js-logger");

const { Monitoring } = require("../../models");
const errorHandler = require("../errorHandler");

const deactiveMonitoring = async (ChatId) => {
  try {
    logger.info("[deactiveMonitoring] Deactiving monitoring");

    await Monitoring.findOneAndUpdate({ ChatId }, { active: false });
  } catch (error) {
    errorHandler({ error, params: ChatId, functionName: "deactiveMonitoring" });
  }
};

module.exports = deactiveMonitoring;
