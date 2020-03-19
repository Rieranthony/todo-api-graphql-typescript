import { ICommonFields } from "./common.interfaces";
import { Document } from "mongoose";

export enum ToDoStatus {
  PENDING = "PENDING",
  DONE = "DONE"
}

export interface IToDoInput {
  _id: string;
  deletedAt: Date;
  title: string;
  description: string;
  status: ToDoStatus;
  dueDate: Date;
}

export interface IToDo extends ICommonFields, Document {
  title: string;
  description: string;
  status: ToDoStatus;
  dueDate: Date;
}
