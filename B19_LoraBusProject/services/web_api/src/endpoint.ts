import { DATABASE_URL } from "./config";

let databaseLoginEndpoint: string;

if (DATABASE_URL) {
  databaseLoginEndpoint = `${DATABASE_URL}/api/user/login`;
}

export { databaseLoginEndpoint };
