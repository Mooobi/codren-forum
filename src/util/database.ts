import { MongoClient } from 'mongodb';

const url = process.env.DB_URL as string;

let connectDB: Promise<MongoClient>;

declare global {
  namespace globalThis {
    var _mongo: Promise<MongoClient>;
  }
}

if (process.env.NODE_ENV === 'development') {
  if (!globalThis._mongo) {
    globalThis._mongo = new MongoClient(url).connect();
  }
  connectDB = globalThis._mongo;
} else {
  connectDB = new MongoClient(url).connect();
}

export { connectDB };
