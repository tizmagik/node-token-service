import express from "express";
import type { Server } from "http";
import {
  getSecrets,
  postToken,
  deleteToken,
  errorHandling,
} from "./middleware";

export async function server(): Promise<Server> {
  const { PORT = "8080" } = process.env;

  const app = express();
  app.disable("etag").disable("x-powered-by");

  // request body size limit (this is already the default, but just to be explicit)
  app.use(express.json({ limit: "100kb" }));

  app.get("/tokens", getSecrets);
  app.post("/token", postToken);
  app.delete("/token/:token", deleteToken);

  app.use(errorHandling);

  const server = app.listen({ port: PORT }, (): void => {
    console.log(`🚀  Service ready at http://localhost:${PORT}/`);
  });

  return server;
}
