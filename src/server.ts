import express from "express";
import type { Server } from "http";
import { deleteToken, getTokens, postToken } from "./middleware";

export async function server(): Promise<Server> {
  const { PORT = "8080" } = process.env;

  const app = express();
  app.disable("etag").disable("x-powered-by");

  app.use(express.json()); // 100KB request body size limit (by default)

  app.get("/tokens", getTokens);
  app.post("/token", postToken);
  app.delete("/token/:token", deleteToken);

  const server = app.listen({ port: PORT }, (): void => {
    console.log(`🚀  Service ready at http://localhost:${PORT}/`);
  });

  return server;
}
