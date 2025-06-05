import { getLogger } from "@logtape/logtape";
import { delay } from "@std/async/delay";

export async function scrape(url: string): Promise<string> {
  const logger = getLogger(["galmuri", "scrape"]);
  logger.debug("Starting scrape for URL: {url}", { url });

  try {
    const htmlContent = `<html><body><h1>Scraped content from ${url}</h1></body></html>`;
    await delay(1000); // Simulate network delay
    logger.info("Successfully scraped content from {url}", { url });
    return htmlContent;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error("Failed to scrape content from {url}: {errorMessage}", { url, errorMessage });
    throw error;
  }
}