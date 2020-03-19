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

  it(`should return an empty array if there is no todo`, async () => {
    const server = new ApolloServer({
      schema: graphQLSchema
    });

    // use the test server to create a query function
    const { query } = createTestClient(server);

    const GET_ALL_TODO = gql`
      query getAllToDo {
        getAllToDo {
          _id
        }
      }
    `;

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

    const GET_ALL_TODO = gql`
      query getAllToDo {
        getAllToDo {
          _id
        }
      }
    `;

    // run query against the server and snapshot the output
    const res = await query({
      query: GET_ALL_TODO
    });

    expect(res).toMatchSnapshot();
  });

  it(`should return a specific todo`, async () => {
    const server = new ApolloServer({
      schema: graphQLSchema
    });

    const GET_TODO = gql`
      query getToDo($_id: ID!) {
        getToDo(_id: $_id) {
          _id
          status
        }
      }
    `;

    // use the test server to create a query function
    const { query } = createTestClient(server);

    // Populate database with todos
    await populateDatabase(ToDoMongooseModel, mockTodo);

    // run query against the server and snapshot the output
    const res = await query({
      query: GET_TODO,
      variables: {
        _id: mockTodo[1]._id
      }
    });

    expect(res).toMatchSnapshot();
  });

  it(`should create a to do`, async () => {
    const server = new ApolloServer({
      schema: graphQLSchema
    });

    // use the test server to create a query function
    const { mutate } = createTestClient(server);

    const CREATE_TO_DO = gql`
      mutation createToDo($input: ToDoInput!) {
        createToDo(input: $input) {
          title
          description
          status
        }
      }
    `;

    // run query against the server and snapshot the output
    const res = await mutate({
      mutation: CREATE_TO_DO,
      variables: {
        input: {
          title: "Test create todo",
          description: "Test create description todo"
        }
      }
    });

    expect(res).toMatchSnapshot();
  });

  it(`should update a to do`, async () => {
    const server = new ApolloServer({
      schema: graphQLSchema
    });

    // Populate database with todos
    await populateDatabase(ToDoMongooseModel, mockTodo);

    // use the test server to create a query function
    const { mutate } = createTestClient(server);

    const UPDATE_TO_DO = gql`
      mutation updateToDo($input: ToDoInput!) {
        updateToDo(input: $input) {
          _id
          title
          description
        }
      }
    `;

    // run query against the server and snapshot the output
    const res = await mutate({
      mutation: UPDATE_TO_DO,
      variables: {
        input: {
          id: mockTodo[0]._id,
          title: "Updated todo title",
          description: "Updated todo description",
          status: ToDoStatus.DONE
        }
      }
    });

    expect(res).toMatchSnapshot();
  });

  it(`should delete a to do`, async () => {
    const server = new ApolloServer({
      schema: graphQLSchema
    });

    // Populate database with todos
    await populateDatabase(ToDoMongooseModel, mockTodo);

    // use the test server to create a query function
    const { mutate } = createTestClient(server);

    const DELETE_TO_DO = gql`
      mutation deleteToDo($_id: ID!) {
        deleteToDo(_id: $_id) {
          _id
          title
          description
        }
      }
    `;

    // run query against the server and snapshot the output
    const res = await mutate({
      mutation: DELETE_TO_DO,
      variables: {
        id: mockTodo[0]._id
      }
    });

    expect(res).toMatchSnapshot();
  });
});
