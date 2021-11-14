const logger = require("js-logger");
const clearPrice = require("../clearPrice");
const errorHandler = require("../errorHandler");

const scrapperWithUrl = async ($, url) => {
  try {
    logger.info("[scrapperWithUrl] Verify scrapping with url");

    const values = [];

    $(".col-lg-5")
      .get()
      .map((item) => {
        const value = $(item).find("span[data-testid='integer']");

        values.push(clearPrice(value.text()));
      });

    const title = $(".OverviewArea_TitleText__1s_GP").text();

    return [{ url, value: clearPrice(values[0]), title }];
  } catch (error) {
    errorHandler({
      error,
      params: ("$", url),
      functionName: "scrapperWithUrl",
    });
  }
};

module.exports = scrapperWithUrl;
