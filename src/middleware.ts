import type { NextFunction, Request, Response } from "express";
import { deleteSecret, getSecret, setSecret } from "./tokens";

const MAX_REQ = 100; // max tokens to GET per request

/** tokens mapped to secrets */
interface TokensGetResponse {
  [token: string]: string;
}

/**
 * Retrieves secret(s) for given token(s)
 * Any not found will just fall off from response silently
 *
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
export async function getSecrets(req: Request, res: Response): Promise<void> {
  if (!req.query["t"]) return res.sendStatus(400).end();

  const tokenQuery = req.query["t"];
  if (typeof tokenQuery === "string") {
    const tokens = tokenQuery.split(",");

    if (tokens.length > MAX_REQ) {
      return res.status(400).send(`Max of ${MAX_REQ} tokens per request`).end();
    }

    const response: TokensGetResponse = {};

    const getAllSecrets = tokens.map((token) => getSecret(token));
    const settledSecrets = await Promise.allSettled(getAllSecrets);

    settledSecrets.forEach((settled, idx) => {
      if (settled.status === "fulfilled" && settled.value) {
        response[tokens[idx]] = settled.value;
      }
    });

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
export async function postToken(req: Request, res: Response): Promise<void> {
  if (!req.body?.secret) {
    return res.sendStatus(400).end();
  }

  const token = await setSecret(req.body.secret);
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

/**
 * General error handling middleware
 *
 * @param err The error that occurred
 * @param res In production, no error details in response. In dev full error info.
 */
export function errorHandling(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): Response {
  // general error handling middleware
  console.error(err); // in practice, these should update metrics somewhere
  res.status(500);

  if (process.env.NODE_ENV === "production") {
    return res.send("Sorry, an error occurred");
  }

  return res.send(`
    <html>
      <body>
        <h1>${err.name + " " + err.message}</h1>
        <pre>${err.stack}</pre>
      </body>
    </html>
  `);
}
