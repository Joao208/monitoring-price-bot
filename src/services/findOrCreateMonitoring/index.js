const { Monitoring } = require("../../models");

const findOrCreateMonitoring = async (ChatId) => {
  const monitoringChat = await Monitoring.findOne({ ChatId });

  if (!monitoringChat) await Monitoring.create({ ChatId });
};

module.exports = findOrCreateMonitoring;
