const { Monitoring } = require("../../models");
const saveUrl = require("../saveUrl");

const saveProductOrUrl = async (text, ChatId) => {
  try {
    new URL(text);

    saveUrl(text, ChatId);
  } catch {
    await Monitoring.findOneAndUpdate(
      { ChatId },
      { product: text, active: true, url: "", InterestPrice: 0, answered: true }
    );
  }
};

module.exports = saveProductOrUrl;
