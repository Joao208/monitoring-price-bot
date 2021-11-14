const mongoose = require("mongoose");
const logger = require("js-logger");

const initMongo = () => {
  mongoose
    .connect(process.env.DATABASE_URL)
    .then(() => logger.info("Database connected successfully"))
    .catch((error) => logger.error(`Error in connect with database ${error}`));
};

module.exports = initMongo;
