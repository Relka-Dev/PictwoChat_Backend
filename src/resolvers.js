import { roomMutations, roomQueries } from "./resolvers/room.js";

export function resolvers({ database }) {
  return {
    Query: {
      hello: async () => {
        return "Hello!"
      },
      users: async () => {
        return { "username": "test", "password": "password" }
      },
      ...roomQueries(database)
    },
    Mutation: {
      testInsert: async () => {
        const collection = database.collection('test')
        await collection.insertOne({ "value": "MUHAHAHA" })
        return "Successfully inserted data into DB."
      },
      ...roomMutations(database)
    }
  };
};