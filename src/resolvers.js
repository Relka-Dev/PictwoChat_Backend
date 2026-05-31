import { roomMutations, roomQueries } from "./resolvers/room.js";
import { userMutations, userQueries } from "./resolvers/user.js";

export function resolvers({ database }) {
  return {
    Query: {
      hello: async () => "Hello!",
      ...userQueries(database),
      ...roomQueries(database),
    },
    Mutation: {
      testInsert: async () => {
        const collection = database.collection('test');
        await collection.insertOne({ value: "MUHAHAHA" });
        return "Successfully inserted data into DB.";
      },
      ...userMutations(database),
      ...roomMutations(database),
    },
  };
};