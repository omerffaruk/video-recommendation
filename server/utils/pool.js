import PG from "pg";
const Pool = PG.Pool;
const localDbUsername = process.env.LOCAL_DB_USERNAME;
const localDbPassword = process.env.LOCAL_DB_PASSWORD;

const dbUrl = process.env.DATABASE_URL || `postgres://${localDbUsername}:${localDbPassword}@localhost:5432/goal`;

const pool = new Pool({
	connectionString: dbUrl,
	connectionTimeoutMillis: 5000,
	ssl: dbUrl.includes("localhost") ? false : { rejectUnauthorized: false },
});

export default pool;