/* eslint-disable require-await */
import { assertDefined } from "@app/utils";
import NotFoundError from "@app/utils/repositories/errors/NotFoundError";
import UnprocessableEntityError from "@app/utils/repositories/errors/UnprocessableEntityError";
import { Label, LabelID } from "@modules/label";
import { CreationalModel, ID, assertIsCreationalModel } from "../models";
import { UpdateModel } from "../models/todo.model";
import Repository from "../repositories/Repository";

const TodoValues: {[key: ID]: {
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
  getOneById = jest.fn((id: ID) => {
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
  } );

  getAll = jest.fn(() => {
    const ret = Object.values(TodoValues).map((found) => ( {
      id: found.id,
      dueDate: found.dueDate,
      message: found.message,
      label: LabelValues[found.labelId],
    } ));

    return Promise.resolve(ret);
  } );

  createOne = jest.fn((creationalModel: CreationalModel) => {
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
      dueDate: new Date(creationalModel.dueDate),
      message: creationalModel.message,
      labelId: creationalModel.labelId,
    };

    return Promise.resolve();
  } );

  updateOneById = jest.fn((id: ID, partial: UpdateModel) => {
    assertDefined(id);
    assertDefined(partial);

    this.#assertModelExists(id);

    TodoValues[id] = {
      id,
      dueDate: partial.dueDate ? new Date(partial.dueDate) : TodoValues[id].dueDate,
      message: partial.message ?? TodoValues[id].message,
      labelId: partial.labelId ?? TodoValues[id].labelId,
    };

    return Promise.resolve();
  } );

  deleteOneById = jest.fn((id: ID) => {
    assertDefined(id);

    this.#assertModelExists(id);

    delete TodoValues[id];

    return Promise.resolve();
  } );

  #modelExists(id: ID): boolean {
    return !!TodoValues[id];
  }

  #assertModelExists(id: ID): void {
    if (!this.#modelExists(id))
      throw new NotFoundError(`id ${id} not found`);
  }
}
