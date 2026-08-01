import postgres from "postgres";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "Missing DATABASE_URL. Configure it in the Vercel environment before using db.js.",
  );
}

const sql = postgres(connectionString, {
  connect_timeout: 10,
  idle_timeout: 20,
  max: 1,
  prepare: false,
});

export default sql;
