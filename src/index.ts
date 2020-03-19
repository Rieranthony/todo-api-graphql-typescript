import * as mongoose from "mongoose";
import { ApolloServer } from "apollo-server-express";
import * as express from "express";

import server, { IDependencies } from "./server";
import config from "./config";

const dependencies: IDependencies = {
  config,
  mongoose,
  ApolloServer,
  express
};

server(dependencies);
