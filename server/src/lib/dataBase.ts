import { neon } from "@neondatabase/serverless";
import { DatabaseUrl } from "./enviromentConfig";

const sql = neon(`${DatabaseUrl}`);

export default sql;