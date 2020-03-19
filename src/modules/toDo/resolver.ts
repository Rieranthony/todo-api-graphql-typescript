import { ApolloError } from "apollo-server-express";

import ToDoService from "./service";
import { IToDo, IToDoInput } from "../../interfaces/toDo.interface";
import { ResolverMap } from "../../interfaces/common.interfaces";

import { ERROR_ID_MISSING } from "../../constants";
import logger from "../../logger";

export default (toDoService: ToDoService): ResolverMap<IToDo> => {
  return {
    Query: {
      getAllToDo: async () => {
        logger.info("Get all to do requested.");

        return await toDoService.getAll();
      },
      getToDo: async (_, { _id }: { _id: string }) => {
        logger.info("Get to do with _id: ", _id);

        return await toDoService.findBy("_id", _id);
      }
    },
    Mutation: {
      createToDo: async (_, args: { input: IToDoInput }) => {
        // TODO: check inputs using Yup for instance
        logger.info("Delete to do with data: ", args.input);

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

        logger.info("Delete to do with _id: ", _id, data);

        return await toDoService.updateBy("_id", _id, data);
      },
      deleteToDo: async (_, { _id }: { _id: string }) => {
        if (!_id) {
          throw new ApolloError(
            "_id is missing to delete the to do",
            ERROR_ID_MISSING
          );
        }

        logger.info("Delete to do with _id: ", _id);

        return await toDoService.delete(_id);
      }
    }
  };
};
