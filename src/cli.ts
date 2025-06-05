import { Command } from "@cliffy/command";
import { ansiColorFormatter, configure, getLogger, getStreamSink } from "@logtape/logtape";
import { AsyncLocalStorage } from "node:async_hooks";
import metadata from "../deno.json" with { type: "json" };
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
    { category: ["galmuri"], lowestLevel: "debug", sinks: ["console"] }
  ]
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
    logger.info("Hello from galmuri CLI!");
    const result = await scrape("https://example.com");
    logger.info("Scraped content: {result}", { result });
  });


if (import.meta.main) {
  logger.debug("Starting galmuri CLI...");
  await command.parse(Deno.args);
}
