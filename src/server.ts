import express from "express";
import type { Server } from "http";
import { deleteSecret, getSecret, setSecret } from "./tokens";

export async function server(): Promise<Server> {
  const { PORT = "8080" } = process.env;

  const app = express();
  app.disable("etag").disable("x-powered-by");

  app.use(express.json());

  // TODO: Debug route, delete me
  app.get("/", (req, res) => res.end("hello!"));

  app.get("/tokens", (req, res) => {
    if (!req.query["t"]) return res.sendStatus(400).end();

    const tokenQuery = req.query["t"];
    if (typeof tokenQuery === "string") {
      const tokens = tokenQuery.split(",");

      const response: { [token: string]: string } = {};

      for (let i = 0; i < tokens.length && i < 10; i++) {
        // max of 10 tokens
        response[tokens[i]] = getSecret(tokens[i]);
      }

      res.json(response).end();
    }
  });

  app.post("/token", (req, res) => {
    if (!req.body?.secret) {
      return res.sendStatus(400).end();
    }

    const token = setSecret(req.body.secret);
    res.json({ token }).end();
  });

  app.delete("/token/:token", (req, res) => {
    if (!req.params.token) {
      return res.sendStatus(400).end();
    }
    deleteSecret(req.params.token);
    res.sendStatus(204).end();
  });

  const server = app.listen({ port: PORT }, (): void => {
    console.log(`🚀  Service ready at http://localhost:${PORT}/`);
  });

  return server;
}
