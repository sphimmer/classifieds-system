// src/index.ts

import "reflect-metadata";
import { createConnection } from "typeorm";
import { ApolloServer } from "apollo-server";
import { buildSchema } from "type-graphql";
import { CategoryResolver } from "./resolvers/CategoryResolver";
import { Container } from "typedi";
import { LocationResolver } from "./resolvers/LocationResolver";
import { UserResolver } from "./resolvers/UserResolver";
import { ListingResolver } from "./resolvers/ListingResolver";

async function main() {
  const connection = await createConnection()

  Container.set("connection", connection);
  const schema = await buildSchema({
    resolvers: [CategoryResolver, LocationResolver, UserResolver, ListingResolver],
    container: Container,
    nullableByDefault: true
  });
  const server = new ApolloServer({ schema })
  await server.listen(4000)
  console.log("Server has started!")
}

main().catch((e) => {
 console.log(e);
});