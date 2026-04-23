// https://www.graphql-js.org/docs/running-an-express-graphql-server/

import { buildSchema } from 'graphql';
import { createHandler } from 'graphql-http/lib/use/express';
import express from 'express';
import { ruruHTML } from 'ruru/server';

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`type Query { hello: String, bye: String, random: Float } `);

// The root provides a resolver function for each API endpoint
const root = {
  hello() {
    return 'Hello world!';
  },
  bye() {
    return 'bye';
  },
  random() {
    return Math.random();
  },

};

const app = express();

// Create and use the GraphQL handler.
app.all(
  '/graphql',
  createHandler({
    schema: schema,
    rootValue: root,
  }),
);

// Start the server at port
app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');

// Serve the GraphiQL IDE.
app.get('/', (_req, res) => {
  res.type('html');
  res.end(ruruHTML({ endpoint: '/graphql' }));
});
