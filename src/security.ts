import type { Request, Response, NextFunction } from "express";
import RateLimit from "express-rate-limit";
import Cors from "cors";

// in practice we'd probably want to use a package like require("content-type")
const ALLOWED_CONTENT_TYPES = [
  "application/json",
  "application/json;charset=utf-8",
];
// eventually may want to support others such as application/x-www-form-urlencoded

export function checkContentType(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.method !== "POST") return next();

  const contentType = req.headers["content-type"]?.toLowerCase();

  // If we have a content-type, make sure it's one of the allowed ones
  if (contentType && !ALLOWED_CONTENT_TYPES.includes(contentType)) {
    return next(
      new Error(`Invalid or no content-type specified: ${contentType}`)
    );
  }

  // if not, default to application/json
  req.headers["content-type"] = "application/json";

  return next();
}

export const rateLimit = RateLimit({
  skip: (req, _res) => req.hostname === "http://localhost", // don't rate limit localhost (TODO: disable in prod)
  headers: false, // don't show rate-limit info to client
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, try again after 15 minutes",
});

export const cors = Cors({
  origin: `http://localhost`, // this would also need prod origins
  allowedHeaders: ["content-type"], //
});
