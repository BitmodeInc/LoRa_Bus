import cors, { CorsOptionsDelegate } from "cors";
import { ALLOWED_ORIGINS } from "../config";

const allowedOrigins = ALLOWED_ORIGINS;

const corsOptionsDelegate: CorsOptionsDelegate = (req, callback) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    callback(null, { origin: true, credentials: true }); // Allow the request
  } else {
    callback(null, { origin: true }); // Block the request
  }
};

const corsOrigins = cors(corsOptionsDelegate);

export { corsOrigins };
