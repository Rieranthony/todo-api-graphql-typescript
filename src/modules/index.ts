import { makeExecutableSchema } from "graphql-tools";
import { gql } from "apollo-server-express";
import * as _ from "lodash";
import { GraphQLSchema } from "graphql";

import * as ToDo from "./toDo";

import { initService } from "../utils";

/*
 * This is due to the Apollo limitation, so we can
 * extend query and Mutation in every typeDefs
 */
const rootDef = gql`
  scalar Date

  enum ToDoStatus {
    PENDING
    DONE
  }

  type Query {
    root: String
  }

  type Mutation {
    root: String
  }
`;

export const initSchemaFromModules = (): GraphQLSchema => {
  // Init services
  const services = {
    toDo: initService(ToDo)
  };

  // Merge all the resolver
  const mergedResolvers = _.merge(ToDo.Resolver(services.toDo));

  // Return the final graphql schema
  return makeExecutableSchema({
    typeDefs: [rootDef, ToDo.TypeDef],
    resolvers: {
      ...mergedResolvers
    }
  });
};
