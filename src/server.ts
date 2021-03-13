import express from "express";
import type { Server } from "http";
import helmet from "helmet";
import {
  getSecrets,
  postToken,
  deleteToken,
  errorHandling,
} from "./middleware";
import { checkContentType, rateLimit } from "./security";

export async function server(): Promise<Server> {
  const { PORT = "8080" } = process.env;

  const app = express();
  app.disable("etag").disable("x-powered-by");

  // content-type sanity check
  app.use(checkContentType);
  // reate-limiting: Ideally this is done at the infra-level, not app-level
  app.use(rateLimit);
  // best-practice security headers via helmet
  app.use(helmet());

  // request size limit for simple url-encoded reqeusts
  app.use(express.urlencoded({ extended: true, limit: "10kb" }));
  // request body size limit (this is already the default, but just to be explicit)
  app.use(express.json({ limit: "100kb" }));

  // functional middleware
  app.get("/tokens", getSecrets);
  app.post("/token", postToken);
  app.delete("/token/:token", deleteToken);

  // error handling
  app.use(errorHandling);

  const server = app.listen({ port: PORT }, (): void => {
    console.log(`🚀  Service ready at http://localhost:${PORT}/`);
  });

  return server;
}
