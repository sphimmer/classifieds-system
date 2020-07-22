// src/index.ts

import "reflect-metadata";
import Koa, { Context } from 'koa';
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
import { checkJWT } from "./util/jwt";
import { authChecker } from "./util/authChecker";
import { IContext } from "./interfaces/IContext";
import AWS from 'aws-sdk'

async function main() {
  const PORT = process.env.PORT || 5000;
  const app = new Koa();
  const router = new KoaRouter();

  /** Middlewares */
  app.use( json() );
  app.use( logger() );
  app.use( bodyParser() );

  const connection = await createConnection()
  var config = new AWS.Config({
    accessKeyId: process.env.AWS_ACCESS_CLIENT_ID, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, region: 'us-east-1'
  });
  Container.set("connection", connection);
  Container.set("S3", new AWS.S3(config));

  const schema = await buildSchema({
    resolvers: [CategoryResolver, LocationResolver, UserResolver, ListingResolver],
    container: Container,
    authChecker: authChecker,
    nullableByDefault: true,
    
  });

  const server = new ApolloServer({ schema, introspection: true, playground: false, context: ({ctx}) :IContext => {
    // get the user token from the headers
    const headers = ctx.request.headers;

    const token = headers['authorization'] ? headers['authorization'].split(' ')[1] : null;
    return {token: token}
    
  }});

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