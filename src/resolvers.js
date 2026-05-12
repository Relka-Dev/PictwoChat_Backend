export function resolvers({ database }) {
  return {
    Query: {
      hello: async () => {
        return "Hello!"
      },
      users: async () => {
        return { "username": "test", "password": "password" }
      },
      rooms: async () => {
        const collection = database.collection('rooms');
        return await collection.find({}).toArray(); // Return every room
      }
    },
    Mutation: {
      testInsert: async () => {
        const collection = database.collection('test')
        await collection.insertOne({ "value": "MUHAHAHA" })
        return "Successfully inserted data into DB."
      },
      createRoom: async (_parent, args) => {
        const COLL_NAME = 'rooms'
        const collection = database.collection(COLL_NAME)

        const normalizedName = String(args.name).trim()
        if (!normalizedName) {
          throw new Error('Room name cannot be empty.')
        }

        const roomDoc = {
          name: normalizedName,
          createdAt: new Date(), // Returns current datetime
        }

        const result = await collection.insertOne(roomDoc)

        const createdRoom = await collection.findOne({ _id: result.insertedId });

        if (!createdRoom) {
          throw new Error('Failed to create room');
        }

        return {
          _id: createdRoom._id.toString(),
          name: createdRoom.name,
          createdAt: createdRoom.createdAt,
        }
      }
    }
  };
};