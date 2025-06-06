import { Command } from "@cliffy/command";
import {
  ansiColorFormatter,
  configure,
  getLogger,
  getStreamSink,
} from "@logtape/logtape";
import { load } from "@std/dotenv";
import { AsyncLocalStorage } from "node:async_hooks";
import metadata from "../deno.json" with { type: "json" };
import "./env.ts";
import { scrape } from "./scrape.ts";

const consoleSink = getStreamSink(Deno.stderr.writable, {
  formatter: ansiColorFormatter,
});

await configure({
  sinks: { console: (record) => consoleSink(record) },
  loggers: [
    {
      category: ["logtape", "meta"],
      lowestLevel: "warning",
      sinks: ["console"],
    },
    { category: ["galmuri"], lowestLevel: "debug", sinks: ["console"] },
  ],
});
const logger = getLogger(["galmuri", "cli"]);

const command = new Command()
  .name("galmuri")
  .description("A simple CLI application")
  .version(metadata.version)
  .meta("License", "MIT")
  .globalOption("-d, --debug", "Enable debug logging.", {
    async action(options) {
      if (!options.debug) return;
      await configure({
        contextLocalStorage: new AsyncLocalStorage(),
        sinks: { console: consoleSink },
        loggers: [
          {
            category: ["logtape", "meta"],
            lowestLevel: "warning",
            sinks: ["console"],
          },
          { category: ["galmuri"], lowestLevel: "debug", sinks: ["console"] },
        ],
        reset: true,
      });
    },
  })
  .action(async () => {
    const results = await scrape("https://books.toscrape.com");

    if (results.length > 0) {
      logger.info("Total: {count} results", { count: results.length });
      console.table(results);
    } else {
      logger.warn("no results found.");
    }
  });

if (import.meta.main) {
  logger.debug("Starting galmuri CLI...");
  await load({ export: true });
  await command.parse(Deno.args);
}
