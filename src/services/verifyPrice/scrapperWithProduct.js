const logger = require("js-logger");

const scrapperWithProduct = async ($) => {
  try {
    logger.info("[scrapperWithProduct] Verify scrapping with product");

    const prices = [];

    $(".Hits_SearchResultListItem__1w6j-")
      .get()
      .map((item) => {
        const href = $(item).find(".Cell_Content__1630r").attr("href");
        const title = $(item).find(".Text_LabelSmRegular__2Lr6I").text();

        const url = `https://www.buscape.com.br${href}`;

        const value = $(item).find(".Text_LabelMdBold__3KBIj");

        prices.push({ title, value: value.text(), url });
      });

    return prices;
  } catch (error) {
    errorHandler({
      error,
      params: "$",
      functionName: "scrapperWithProduct",
    });
  }
};

module.exports = scrapperWithProduct;
