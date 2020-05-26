// src/index.ts

import "reflect-metadata";
import Koa from 'koa';
import KoaRouter from "koa-router";
import bodyParser from 'koa-bodyparser';
import logger from "koa-logger";
import json from "koa-json";
import { createConnection } from "typeorm";
import { ApolloServer } from 'apollo-server-koa';
import { buildSchema } from "type-graphql";
import { CategoryResolver } from "./resolvers/CategoryResolver";
import { Container } from "typedi";
import { LocationResolver } from "./resolvers/LocationResolver";
import { UserResolver } from "./resolvers/UserResolver";
import { ListingResolver } from "./resolvers/ListingResolver";

async function main() {
  const PORT = process.env.PORT || 3000;
  const app = new Koa();
  const router = new KoaRouter();

  /** Middlewares */
  app.use( json() );
  app.use( logger() );
  app.use( bodyParser() );

  const connection = await createConnection()

  Container.set("connection", connection);

  const schema = await buildSchema({
    resolvers: [CategoryResolver, LocationResolver, UserResolver, ListingResolver],
    container: Container,
    nullableByDefault: true
  });

  const server = new ApolloServer({ schema })

  /** Routes */
  app.use( router.routes() ).use( router.allowedMethods() );

  server.applyMiddleware({ app });

  app.use(router.routes());
  app.use(router.allowedMethods());
  app.listen({ port: PORT }, () =>
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`)
  )
  
}

main().catch((e) => {
 console.log(e);
});