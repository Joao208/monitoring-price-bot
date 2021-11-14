const logger = require("js-logger");

const { Monitoring } = require("../../models");
const errorHandler = require("../errorHandler");
const verifyPrice = require("../verifyPrice");

const getAllMonitorings = async (bot) => {
  try {
    logger.info("[getAllMonitorings] Get All Monitorings to run");

    const monitorings = await Monitoring.find({
      active: true,
      answered: true,
      InterestPrice: { $ne: 0 },
    });

    for (const monitoring of monitorings) {
      if (!monitoring?.product && !monitoring?.url) continue;

      verifyPrice(
        monitoring?.product || monitoring?.url,
        monitoring,
        bot,
        !!monitoring?.url
      );
    }
  } catch (error) {
    errorHandler({ error, bot, params: "", functionName: "getAllMonitorings" });
  }
};

module.exports = getAllMonitorings;
