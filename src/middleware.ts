import type { Request, Response } from "express";
import { deleteSecret, getSecret, setSecret } from "./tokens";

const MAX_REQ = 100; // max tokens to GET per request

/** tokens mapped to secrets */
interface TokensGetResponse {
  [token: string]: string;
}

/**
 * GET /tokens?t=(TOKEN1),(TOKEN2)
 *
 * Response:
 * {
 *  "(TOKEN1)": "(SECRET1)",
 *  "(TOKEN2)": "(SECRET2)"
 * }
 *
 * @param req Express request
 * @param res Express response
 * @returns {void} Ends middleware chain
 */
export function getTokens(req: Request, res: Response): void {
  if (!req.query["t"]) return res.sendStatus(400).end();

  const tokenQuery = req.query["t"];
  if (typeof tokenQuery === "string") {
    const tokens = tokenQuery.split(",");

    if (tokens.length > MAX_REQ) {
      return res.status(400).send(`Max of ${MAX_REQ} tokens per request`).end();
    }

    const response: TokensGetResponse = {};
    for (const token of tokens) {
      const secret = getSecret(token);
      if (secret) response[token] = secret;
    }

    return res.json(response).end();
  }
}

/**
 * POST /token BODY: { secret: "(SECRET)" }
 *
 * Response:
 * { "token": "(TOKEN)" }
 *
 * @param req Express request
 * @param res Express response
 * @returns {void} Ends middleware chain
 */
export function postToken(req: Request, res: Response): void {
  if (!req.body?.secret) {
    return res.sendStatus(400).end();
  }

  const token = setSecret(req.body.secret);
  return res.json({ token }).end();
}

/**
 * DELETE /token/:token
 *
 * Response: STATUS 204 (fails silently to user)
 *
 * @param req Express request
 * @param res Express response
 * @returns {void} Ends middleware chain
 */
export function deleteToken(req: Request, res: Response): void {
  if (!req.params.token) {
    return res.sendStatus(400).end();
  }

  deleteSecret(req.params.token);
  return res.sendStatus(204).end();
}
