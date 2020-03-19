import { createTestClient } from "apollo-server-testing";
import { ApolloServer, gql } from "apollo-server-express";

import { initSchemaFromModules } from "../modules";
import {
  connect,
  clearDatabase,
  closeDatabase,
  populateDatabase
} from "./utils";
import { IToDo, ToDoStatus } from "../interfaces/toDo.interface";
import { ToDoMongooseModel } from "../modules/toDo/model";

beforeAll(async () => connect());

afterEach(async () => {
  await clearDatabase();
});

afterAll(async done => {
  await closeDatabase();
  done();
});

const mockTodo: Partial<IToDo>[] = [
  {
    _id: "5e16075abba89142f8f2afd2",
    title: "Todo 1",
    description: "Desc 1",
    status: ToDoStatus.PENDING
  },
  {
    _id: "5e1607772c8db465edc44a4c",
    title: "Todo 2",
    description: "Desc 2",
    status: ToDoStatus.PENDING
  },
  {
    _id: "5e1607819c9eb8b8be169cf2",
    title: "Todo 3",
    description: "Desc 3",
    status: ToDoStatus.PENDING
  },
  {
    _id: "5e1607878d043e453fcdfea2",
    title: "Todo 4",
    description: "Desc 4",
    status: ToDoStatus.PENDING
  }
];

/**
 * ToDo test suite.
 */
describe("ToDo", () => {
  const graphQLSchema = initSchemaFromModules();

  const GET_ALL_TODO = gql`
    query getAllToDo {
      getAllToDo {
        _id
      }
    }
  `;

  it(`should return an empty array if there is not todo`, async () => {
    const server = new ApolloServer({
      schema: graphQLSchema
    });

    // use the test server to create a query function
    const { query } = createTestClient(server);

    // run query against the server and snapshot the output
    const res = await query({
      query: GET_ALL_TODO
    });

    expect(res).toMatchSnapshot();
  });

  it(`should return an array of to do`, async () => {
    const server = new ApolloServer({
      schema: graphQLSchema
    });

    // Populate database with todos
    await populateDatabase(ToDoMongooseModel, mockTodo);

    // use the test server to create a query function
    const { query } = createTestClient(server);

    // run query against the server and snapshot the output
    const res = await query({
      query: GET_ALL_TODO
    });

    expect(res).toMatchSnapshot();
  });
});
