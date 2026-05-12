import express from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { loadSchemaSync } from "@graphql-tools/load"
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import { resolvers } from "./src/resolvers.js";

// Load .env file
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

// Load MongoDB config
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
const MONGODB_DB = process.env.MONGODB_DB || "pictwochat";

// Import GraphQL schema from file
const typeDefs = loadSchemaSync('./schema/schema.graphql', { loaders: [new GraphQLFileLoader()] });

async function startServer() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const database = client.db(MONGODB_DB);
  const collection = database.collection("test")

  const app = express();
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers: resolvers({ database }),
  });

  await apolloServer.start();

  app.use("/graphql", cors(), express.json(), expressMiddleware(apolloServer));

  app.get("/", (_, res) => {
    res.send("GraphQL API is running. Use /graphql endpoint.");
  });

  // Start server
  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running on http://localhost:${port}/graphql`);
  });
}

startServer().catch((error) => {
  // eslint-disable-next-line no-console
  console.error("Failed to start server:", error);
  process.exit(1);
});