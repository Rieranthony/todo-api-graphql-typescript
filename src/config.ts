import { formatPort, formatEnv } from "./utils";

export type ENVIRONMENT = "production" | "development";

export type Config = {
  api: {
    PORT: number;
    ENVIRONMENT: ENVIRONMENT;
  };
  mongoDB: {
    CONNECTION: {
      URI: string;
    };
  };
  isDev: boolean;
};

const config: Config = {
  api: {
    PORT: formatPort(process.env.PORT) || 5000,
    ENVIRONMENT: formatEnv(process.env.NODE_ENV)
  },
  mongoDB: {
    CONNECTION: {
      URI:
        process.env.MONGO_DB_URI ||
        `mongodb://root:password@localhost:27017/mongo-db-example?authSource=admin`
    }
  },
  isDev: formatEnv(process.env.NODE_ENV) === "development"
};

export default config;
