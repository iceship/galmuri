import "@std/dotenv/load";
import { z } from "zod";

const EnvSchema = z.object({
  BROWSERLESS_ENDPOINT: z.string().url(),
  BROWSERLESS_TOKEN: z.string().min(1, "Browserless token is required"),
});

export type EnvSchema = z.infer<typeof EnvSchema>;

//tryParseEnv(EnvSchema);
console.log("Environment variables loaded successfully.");

export default EnvSchema.parse(Deno.env.toObject());
