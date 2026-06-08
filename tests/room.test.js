import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongoClient, ObjectId } from 'mongodb';
import { createDB, clearDB } from './database';
import { roomMutations } from '../src/resolvers/room';

const ROOM_COLLECTION_NAME = 'rooms';

let db;

describe('Room Tests', () => {
  beforeAll(async () => {
    db = await createDB();
  });

  afterAll(async () => {
    await clearDB();
  });

  it('should insert a room and verify data exists', async () => {
    const data = { name: "SUPER AWESOME ROOM" };

    // Call the createRoom mutation
    await roomMutations(db).createRoom(null, data);

    // Verify the room was created in the database
    const collection = db.collection(ROOM_COLLECTION_NAME);
    const foundRoom = await collection.findOne({
      name: data.name,
    });

    expect(foundRoom).not.toBeNull();
    expect(foundRoom.name).toBe(data.name);
    expect(foundRoom.createdAt).not.toBeNull();
  });

  it('should delete a room and verify data exists', async () => {
    const data = { name: "ROOM TO DELETE" };
    const collection = db.collection(ROOM_COLLECTION_NAME);

    // Create a room to delete
    const result = await roomMutations(db).createRoom(null, data);
    const roomId = result._id;

    const foundRoom = await collection.findOne({
      _id: new ObjectId(roomId),
    });
    expect(foundRoom).not.toBeNull();

    // Call the removeRoom mutation
    await roomMutations(db).removeRoom(null, { _id: roomId });

    // Verify the room was deleted from the database
    const foundRoomAfterDeletion = await collection.findOne({
      _id: new ObjectId(roomId),
    });

    expect(foundRoomAfterDeletion).toBeNull();
  });
});
