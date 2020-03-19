import { ApolloError } from "apollo-server-express";

import ToDoService from "./service";
import { IToDo, IToDoInput } from "../../interfaces/toDo.interface";
import { ResolverMap } from "../../interfaces/common.interfaces";

import { ERROR_ID_MISSING } from "../../constants";

export default (toDoService: ToDoService): ResolverMap<IToDo> => {
  return {
    Query: {
      getAllToDo: async () => {
        return await toDoService.getAll();
      },
      getToDo: async (_, { _id }: { _id: string }) => {
        return await toDoService.findBy("_id", _id);
      }
    },
    Mutation: {
      createToDo: async (_, args: { input: IToDoInput }) => {
        // TODO: check inputs using Yup for instance

        return await toDoService.create(args.input);
      },
      updateToDo: async (_, args: { input: IToDoInput }) => {
        // TODO: check inputs using Yup for instance
        const { _id, ...data } = args.input;

        if (!_id) {
          throw new ApolloError(
            "_id is missing to update the to do",
            ERROR_ID_MISSING
          );
        }

        return await toDoService.updateBy("_id", _id, data);
      },
      deleteToDo: async (_, { _id }: { _id: string }) => {
        console.log("_id", _id);
        if (!_id) {
          throw new ApolloError(
            "_id is missing to delete the to do",
            ERROR_ID_MISSING
          );
        }

        return await toDoService.delete(_id);
      }
    }
  };
};
