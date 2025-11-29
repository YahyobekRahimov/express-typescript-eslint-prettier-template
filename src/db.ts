import pkg from "pg";
import {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
} from "./config/config.js";

const { Pool } = pkg;

export const pool = new Pool({
  host: DB_HOST,
  port: DB_PORT ? parseInt(DB_PORT, 10) : 5432,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
});
