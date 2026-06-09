// db.js
import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer;
let client;
let db;

/**
 * Creates a mock database using MongoMemoryServer and returns the database instance.
 * @returns Database instance
 */
export async function createDB() {
  // Create mock database
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  
  // Connect to the in-memory server
  client = new MongoClient(uri);
  await client.connect();
  
  // Get the database and collection
  db = client.db('test_db');

  return db;
}

/**
 * Stops the in-memory MongoDB server and cleans up resources.
 */
export async function clearDB() {
  await db.dropDatabase();
}