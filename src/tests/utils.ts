import * as mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

const mongod = new MongoMemoryServer();

// Connect to the in-memory database.
export const connect = async () => {
  const uri = await mongod.getConnectionString();

  const mongooseOpts = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    socketTimeoutMS: 10000,
    autoIndex: false
  };

  await mongoose.connect(uri, mongooseOpts);
};

//Populate db with a schema and data for test purpose only
export const populateDatabase = async (model: any, data: any[]) => {
  try {
    const result = await model.insertMany(data);
    return result;
  } catch (err) {
    console.error("populateDatabase failed", err);
    return err;
  }
};

// Drop database, close the connection and stop mongod.
export const closeDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
};

// Remove all the data for all db collections.
export const clearDatabase = async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
};
