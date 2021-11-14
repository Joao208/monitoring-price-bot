const { Monitoring } = require("../../models");

const findOrCreateMonitoring = async (ChatId) => {
  const monitoringChat = await Monitoring.findOne({ ChatId });

  if (!monitoringChat) return Monitoring.create({ ChatId });
  else return monitoringChat;
};

module.exports = findOrCreateMonitoring;
