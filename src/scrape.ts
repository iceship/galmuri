import { getLogger } from "@logtape/logtape";
import puppeteer from "puppeteer-core";
import env from "./env.ts";
export interface SaleInfo {
  title: string;
  price: string;
  recommendations: string;
  time: string;
  views: string;
  link: string;
}
export async function scrape(url: string): Promise<SaleInfo[]> {
  const logger = getLogger(["galmuri", "scrape"]);
  logger.info("Scraping with HTML parser for URL: {url}", { url });

  const endpoint = `${env.BROWSERLESS_ENDPOINT}?token=${env.BROWSERLESS_TOKEN}`;

  const browser = await puppeteer.connect({ browserWSEndpoint: endpoint });

  try {
    const browser = await puppeteer.connect({ browserWSEndpoint: endpoint });
    const page = await browser.newPage();
    await page.goto(url);
    const html = await page.content();

    logger.debug("Successfully fetched HTML content.");
    logger.debug("Parsing HTML content...");
    logger.debug("HTML content length: {length}", { length: html.length });
    logger.debug("HTML content: {html}", { html });

    const saleItems: SaleInfo[] = [];

    logger.info("Successfully scraped {count} items.", {
      count: saleItems.length,
    });
    return saleItems;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error("Failed to scrape content from {url}: {errorMessage}", {
      url,
      errorMessage,
    });
    throw error;
  } finally {
    logger.info("Closing browser instance...");
    await browser.close();
  }
}
