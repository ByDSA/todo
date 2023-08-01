/* eslint-disable require-await */
import { assertDefined } from "@app/utils";
import UnprocessableEntityError from "@app/utils/repositories/errors/UnprocessableEntityError";
import { Label, LabelRepository } from "@modules/label";
import Model, { CreationalModel, ID, assertIsCreationalModel, assertIsModel } from "../../models";
import { UpdateModel } from "../../models/todo.model";
import { assertIsUpdateModel } from "../../models/utils";
import Repository from "../Repository";
import ThisModelNotFoundError from "./ThisModelNotFoundError";
import { documentToModel } from "./model-conversions";
import { ModelODM, ThisDocument } from "./todo";

const DEFAULT_LABEL: Label = Object.freeze( {
  id: "0",
  name: "Null Label",
} );

type Dependencies = {
  labelRepository: LabelRepository;
};
export default class MongoRepository implements Repository {
  readonly #labelRepository: LabelRepository;

  constructor(dependencies: Dependencies) {
    this.#labelRepository = dependencies.labelRepository;
  }

  #errorHandler(e: unknown) {
    const isObjectIDFormatError = e instanceof Error && e.message.includes("Cast to ObjectId failed");

    if (isObjectIDFormatError) {
      const id = e.message.match(/value "(.*?)"/)?.[1] ?? "undefined";

      throw new ThisModelNotFoundError(id);
    }

    throw e;
  }

  async getOneById(id: ID): Promise<Model | null> {
    assertDefined(id);

    let found: ThisDocument | null = null;

    try {
      found = await ModelODM.findById(id);
    } catch (e) {
      this.#errorHandler(e);
    }

    if (!found)
      return null;

    const label: Label = await this.#getOneLabelByIdOrDefault(found.labelId);
    const ret: Model = documentToModel(found, label);

    assertIsModel(ret);

    return ret;
  }

  async #getOneLabelByIdOrDefault(id: ID): Promise<Label> {
    return await this.#labelRepository.getOneById(id) ?? DEFAULT_LABEL;
  }

  async #getOneLabelByIdOrFail(id: ID): Promise<Label> {
    const found = await this.#labelRepository.getOneById(id);

    if (!found)
      throw new UnprocessableEntityError(`Label with id ${id} not found`);

    return found;
  }

  async createOne(creationalModel: CreationalModel): Promise<void> {
    try {
      assertIsCreationalModel(creationalModel);
    } catch (e) {
      throwUnexpectedDataErrorFrom(e, creationalModel);
    }

    const fixedLabel = await this.#getOneLabelByIdOrFail(creationalModel.labelId);

    try {
      await ModelODM.create( {
        dueDate: creationalModel.dueDate,
        message: creationalModel.message,
        labelId: fixedLabel.id,
      } );
    } catch (e) {
      this.#errorHandler(e);
    }
  }

  async getAll(): Promise<Model[]> {
    let found: ThisDocument[] = [];

    try {
      found = await ModelODM.find();
    } catch (e) {
      this.#errorHandler(e);
    }

    if (!found || found.length === 0)
      return [];

    const ret = found.map(async (item) => {
      const label: Label = await this.#getOneLabelByIdOrDefault(item.labelId);
      const todo: Model = documentToModel(item, label);

      assertIsModel(todo);

      return todo;
    } );

    return Promise.all(ret);
  }

  async updateOneById(id: ID, partial: UpdateModel): Promise<void> {
    assertDefined(id);

    try {
      assertIsUpdateModel(partial);
    } catch (e) {
      throwUnexpectedDataErrorFrom(e, partial);
    }

    const fixedPartial: UpdateModel = {
      ...partial,
    };

    if (fixedPartial.labelId) {
      const fixedLabel = await this.#getOneLabelByIdOrFail(fixedPartial.labelId);

      fixedPartial.labelId = fixedLabel.id;
    }

    try {
      const exists = await ModelODM.exists( {
        _id: id,
      } );

      if (!exists)
        throw new ThisModelNotFoundError(id);

      await ModelODM.updateOne( {
        _id: id,
      }, fixedPartial);
    } catch (e) {
      this.#errorHandler(e);
    }
  }

  async deleteOneById(id: ID): Promise<void> {
    assertDefined(id);

    try {
      const { deletedCount } = await ModelODM.deleteOne( {
        _id: id,
      } );

      if (deletedCount === 0)
        throw new ThisModelNotFoundError(id);
    } catch (e) {
      this.#errorHandler(e);
    }
  }
}

function throwUnexpectedDataErrorFrom(e: unknown, data?: unknown) {
  let msg = `${e instanceof Error ? e.message : ""}`;

  if (data)
    msg += `\nActual: ${JSON.stringify(data, null, 2)}`;

  console.error(msg);

  throw new UnprocessableEntityError(msg);
}
