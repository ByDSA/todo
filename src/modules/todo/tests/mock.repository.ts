/* eslint-disable require-await */
import { assertDefined } from "@app/utils";
import AlreadyExistsError from "@app/utils/models/repositories/errors/AlreadyExistsError";
import NotFoundError from "@app/utils/models/repositories/errors/NotFoundError";
import UnprocessableEntityError from "@app/utils/models/repositories/errors/UnprocessableEntityError";
import { Label, LabelID } from "@modules/label";
import Model, { CreationalModel, ID, assertIsCreationalModel } from "../models";
import { UpdateModel } from "../models/todo.model";
import Repository from "../repositories/Repository";

export const TodoValues: {[key: ID]: {
  id: ID;
  dueDate: Date;
  message: string;
  labelId: LabelID;
}} = {
  1: {
    id: "1",
    dueDate: new Date(),
    message: "Do something",
    labelId: "1",
  },
};
const LabelValues: {[key: LabelID]: Label} = {
  1: {
    id: "1",
    name: "Work",
  },
};

export default class MockRepository implements Repository {
  async getOneById(id: ID): Promise<Model> {
    const found = TodoValues[id];

    if (!found)
      throw new NotFoundError(`id ${id} not found`);

    const ret = {
      id: found.id,
      dueDate: found.dueDate,
      message: found.message,
      label: LabelValues[found.labelId],
    };

    return Promise.resolve(ret);
  }

  async createOne(creationalModel: CreationalModel): Promise<void> {
    try {
      assertIsCreationalModel(creationalModel);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "";

      throw new UnprocessableEntityError(msg);
    }

    let id: string;

    do
      id = (Math.ceil(Math.random() * 99999)).toString();
    while (this.#modelExists(id));

    const label = LabelValues[creationalModel.labelId];

    if (!label)
      throw new UnprocessableEntityError(`labelId ${creationalModel.labelId} not found`);

    TodoValues[id] = {
      id,
      dueDate: creationalModel.dueDate,
      message: creationalModel.message,
      labelId: creationalModel.labelId,
    };
  }

  #modelExists(id: ID): boolean {
    return !!TodoValues[id];
  }

  #assertModelExists(id: ID): void {
    if (!this.#modelExists(id))
      throw new NotFoundError(`id ${id} not found`);
  }

  #assertModelDoesNotExist(id: ID): void {
    if (this.#modelExists(id))
      throw new AlreadyExistsError(`id ${id} already exists`);
  }

  async updateOneById(id: ID, partial: UpdateModel): Promise<void> {
    assertDefined(id);
    assertDefined(partial);

    this.#assertModelExists(id);

    TodoValues[id] = {
      id,
      dueDate: partial.dueDate ?? TodoValues[id].dueDate,
      message: partial.message ?? TodoValues[id].message,
      labelId: partial.labelId ?? TodoValues[id].labelId,
    };
  }

  async deleteOneById(id: ID): Promise<void> {
    assertDefined(id);

    this.#assertModelExists(id);

    delete TodoValues[id];
  }
}
