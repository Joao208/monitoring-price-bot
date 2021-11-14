const getProperties = () => ({
  ChatId: String,
  LastPrice: Number,
  InterestPrice: Number,
  url: String,
  product: String,
  active: { type: Boolean, default: true },
  TitlesToIgnore: [String],
  LastTitle: String,
  answered: Boolean,
});

module.exports = getProperties;
