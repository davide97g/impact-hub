import postgres from "postgres";

const connectionString = process.env.DATABASE_URL;
console.log({ connectionString });

if (!connectionString) {
  throw new Error(
    "Please define the DATABASE_URL environment variable inside .env.local"
  );
}

const sql = postgres(connectionString);

export { sql };
