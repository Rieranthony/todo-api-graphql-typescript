import { gql } from "apollo-server-express";

export default gql`
  type ToDo {
    _id: ID!
    title: String!
    description: String
    status: ToDoStatus
    dueDate: Date!
    createdAt: Date!
    updatedAt: Date!
    deletedAt: Date
  }

  input ToDoInput {
    _id: ID
    title: String
    description: String
    status: ToDoStatus
    dueDate: Date
    deletedAt: Date
  }

  extend type Query {
    getAllToDo: [ToDo]!
    getToDo(_id: ID!): ToDo
  }

  extend type Mutation {
    createToDo(input: ToDoInput): ToDo!
    updateToDo(input: ToDoInput): ToDo
    deleteToDo(_id: ID!): ToDo
  }
`;
