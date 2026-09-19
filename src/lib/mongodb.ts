import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB_NAME || "sartaj_solar";

if (!uri) {
  console.warn("Please define the MONGODB_URI environment variable inside .env");
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!uri) {
  // Dummy promise during build if URI is missing
  clientPromise = Promise.reject(new Error("MONGODB_URI is not defined in environment variables"));
} else if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 8000,
    });
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 8000,
  });
  clientPromise = client.connect();
}

export default clientPromise;

export async function getDatabase(): Promise<Db> {
  const client = await clientPromise;
  if (process.env.MONGODB_DB_NAME) {
    return client.db(process.env.MONGODB_DB_NAME);
  }
  return client.db();
}
