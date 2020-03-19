import ToDoModel from "./model";
import { IToDo } from "../../interfaces/toDo.interface";

export default class ToDoService {
  private model: ToDoModel;

  constructor(model: ToDoModel) {
    this.model = model;
  }

  public create = async (data: Partial<IToDo>): Promise<IToDo> =>
    this.model.create(data);

  public getAll = async (): Promise<Partial<IToDo>[]> => this.model.getAll();

  public findBy = async (
    key: keyof IToDo,
    value: any
  ): Promise<Partial<IToDo>> => this.model.findBy(key, value);

  public delete = async (_id: string): Promise<Partial<IToDo> | null> =>
    this.model.delete(_id);

  public updateBy = async (
    key: keyof IToDo,
    keyValue: any,
    data: Partial<IToDo>
  ): Promise<Partial<IToDo> | null> => this.model.updateBy(key, keyValue, data);
}
