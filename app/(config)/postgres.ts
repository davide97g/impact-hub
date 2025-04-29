import postgres from "postgres";

const connectionString = process.env.NEXT_DATABASE_URL;
console.log({ connectionString });

if (!connectionString) {
  throw new Error(
    "Please define the NEXT_DATABASE_URL environment variable inside .env.local"
  );
}

const sql = postgres(connectionString);

export { sql };
