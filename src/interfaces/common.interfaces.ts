export interface ICommonFields {
  // id and _id are in the Document type
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export type Resolver<T> = (
  parent: T,
  args: any,
  context: any,
  info: any
) => any;

export interface ResolverMap<T> {
  Query: {
    [key: string]: Resolver<T>;
  };
  Mutation: {
    [key: string]: Resolver<T>;
  };
}
