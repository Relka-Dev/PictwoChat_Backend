import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongoClient, ObjectId } from 'mongodb';
import { createDB, clearDB } from './database';
import { userMutations } from '../src/resolvers/user';

const USER_COLLECTION_NAME = 'users';

let db;

describe('Users Tests', () => {
  beforeAll(async () => {
    // Define a JWT secret in the env to test token generation in the user resolver
    process.env.JWT_SECRET ||= 'test-jwt-secret';
    db = await createDB();
  });

  afterAll(async () => {
    await clearDB();
  });

  it('should register a user, verify data exists and token is returned', async () => {
    const data = { 
      username: "i_like_cheese_67",
      email: "cheese.liker@cheese.com",
      password: "my_super_secure_password_trust_me",
    };

    // Call the register mutation
    const result = await userMutations(db).register(null, data);
    expect(result.token).toBeDefined();

    // Verify the room was created in the database
    const collection = db.collection(USER_COLLECTION_NAME);
    const foundUser = await collection.findOne({
      email: data.email,
    });

    expect(foundUser).not.toBeNull();
    expect(foundUser.username).toBe(data.username);
    expect(foundUser.email).toBe(data.email);
    expect(foundUser.password).not.toBe(data.password);
    expect(foundUser.createdAt).not.toBeNull();
  });
});
