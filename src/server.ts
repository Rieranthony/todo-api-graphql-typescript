import { Mongoose } from "mongoose";
import { ApolloServer as IApolloServer, gql } from "apollo-server-express";
import * as IExpress from "express";
import * as helmet from "helmet";
import * as cors from "cors";
import * as bodyParser from "body-parser";

import { Config } from "./config";
import logger from "./logger";
import { initSchemaFromModules } from "./modules";

export interface IDependencies {
  config: Config;
  mongoose: Mongoose;
  ApolloServer: typeof IApolloServer;
  express: typeof IExpress;
}

const connectToDatabase = (mongoose: Mongoose, uri: string) => {
  const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    socketTimeoutMS: 10000,
    autoIndex: false
  };

  mongoose.connection.on("connected", () => {
    logger.info(`🥰 Mongoose connected to mongoDB`);
  });

  mongoose.connection.on("reconnected", () => {
    logger.info("😬 Mongoose default connection is reconnected");
  });

  mongoose.connect(encodeURI(uri), { ...options }).catch(err => {
    logger.error("🤕 Error while connecting to mongoDB", err);
  });
};

export default ({ config, mongoose, ApolloServer, express }: IDependencies) => {
  // Initialize app
  const app = express();

  // Init database with mongoose
  connectToDatabase(mongoose, config.mongoDB.CONNECTION.URI);

  // Init schemas
  const graphQLSchema = initSchemaFromModules();

  // Allow CORS requests
  app.use(cors());

  app.use(helmet());

  app.use(bodyParser.json());

  // Construct a schema, using GraphQL schema language
  const typeDefs = gql`
    type Query {
      hello: String
    }
  `;

  // Provide resolver functions for your schema fields
  const resolvers = {
    Query: {
      hello: () => "Hello world!"
    }
  };

  const server = new ApolloServer({
    schema: graphQLSchema,
    playground: config.isDev,
    debug: config.isDev
  });

  server.applyMiddleware({ app });

  app.listen({ port: config.api.PORT }, () =>
    logger.info(
      `🚀 Server ready at http://localhost:${config.api.PORT}${server.graphqlPath}`
    )
  );
};
