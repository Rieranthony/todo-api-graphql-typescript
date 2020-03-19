import * as mongoose from "mongoose";
import { IToDo, ToDoStatus } from "../../interfaces/toDo.interface";

const toDoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  status: {
    type: String,
    enum: Object.values(ToDoStatus),
    default: ToDoStatus.PENDING,
    required: true
  },
  deletedAt: Date
}).set("timestamps", true);

const ToDoModel = mongoose.model<IToDo & mongoose.Document>("ToDo", toDoSchema);

export default class Model {
  public create = async (data: Partial<IToDo>): Promise<IToDo> => {
    const report = new ToDoModel(data);
    return await report.save();
  };

  public updateBy = async (
    key: keyof IToDo,
    keyValue: any,
    data: Partial<IToDo>
  ): Promise<Partial<IToDo> | null> => {
    const report = await ToDoModel.findOneAndUpdate({ [key]: keyValue }, data, {
      new: true,
      runValidators: true,
      upsert: true
    })
      .lean()
      .exec();

    return report;
  };

  public delete = async (_id: string): Promise<Partial<IToDo> | null> => {
    return await this.updateBy("_id", _id, {
      deletedAt: new Date()
    });
  };

  public findBy = async (
    key: keyof IToDo,
    value: any
  ): Promise<Partial<IToDo>> => {
    const result = await ToDoModel.find({ [key]: value })
      .limit(1)
      .lean()
      .exec();

    return result[0];
  };

  public getAll = async (): Promise<Partial<IToDo>[]> => {
    const result = await ToDoModel.find({ deletedAt: null }).lean();

    return result;
  };
}
