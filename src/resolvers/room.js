import SimpleSchema from "simpl-schema";
import { ObjectId } from "mongodb";

const COLLECTION_NAME = 'rooms';
const ROOM_SCHEMA = new SimpleSchema({
  name: {
    type: String,
    min: 1,
    max: 100,
    trim: true,
  },
  createdAt: {
    type: Date,
  },
})

export const roomQueries = (database) => ({
  /** Retrieve every room in the database. */
  rooms: async () => {
    const collection = database.collection(COLLECTION_NAME);
    return await collection.find({}).toArray(); // Return every room
  },
});

export const roomMutations = (database) => ({
  /** Create a new room. */
  createRoom: async (_parent, args) => {
    const collection = database.collection(COLLECTION_NAME)

    // Define room document
    const doc = {
      name: args.name,
      createdAt: new Date(), // Returns current datetime
    }

    // Verification and cleaning
    ROOM_SCHEMA.validate(doc);
    const cleanedDoc = ROOM_SCHEMA.clean(doc);

    // Insert room into database
    const result = await collection.insertOne(cleanedDoc);
    
    // Return created room
    const createdRoom = await collection.findOne({ _id: result.insertedId });
    if (!createdRoom) {
      throw new Error('Failed to create room');
    }
    
    return {
      _id: createdRoom._id.toString(),
      name: createdRoom.name,
      createdAt: createdRoom.createdAt,
    }
  },
  /** Remove an existing room by id. */
  removeRoom: async (_parent, args) => {
    const collection = database.collection(COLLECTION_NAME);

    const result = await collection.deleteOne({ _id: new ObjectId(args._id) });
    
    if (result.deletedCount === 0) {
      throw new Error('Failed to delete room');
    }

    return `Successfully deleted room with ID ${args._id}`;
  },
})