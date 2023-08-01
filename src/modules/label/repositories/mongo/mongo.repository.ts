/* eslint-disable require-await */
import { assertDefined } from "@app/utils";
import NotFoundError from "@app/utils/repositories/errors/NotFoundError";
import UnprocessableEntityError from "@app/utils/repositories/errors/UnprocessableEntityError";
import Model, { CreationalModel, ID, assertIsCreationalModel, assertIsModel } from "../../models";
import Repository from "../Repository";
import { ModelODM } from "./label";

export default class MongoDBRepository implements Repository {
  async deleteAll(): Promise<void> {
    await ModelODM.deleteMany( {
    } );
  }

  async createMany(models: CreationalModel[]): Promise<void> {
    models.forEach(assertIsCreationalModel);

    await ModelODM.insertMany(models.map((model) => ( {
      id: model.id,
      name: model.name,
    } )));
  }

  async getOneById(id: ID): Promise<Model | null> {
    assertDefined(id);

    const found = await ModelODM.findOne( {
      id,
    } );

    if (!found)
      return null;

    const ret: Model = {
      id: found.id,
      name: found.name,
    };

    assertIsModel(ret);

    return ret;
  }

  async createOne(creationalModel: CreationalModel): Promise<void> {
    try {
      assertIsCreationalModel(creationalModel);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "";

      throw new UnprocessableEntityError(msg);
    }

    await ModelODM.create( {
      id: creationalModel.id,
      name: creationalModel.name,
    } );
  }

  async #modelExists(id: ID): Promise<boolean> {
    return !!await this.getOneById(id);
  }

  async #assertModelExists(id: ID) {
    if (!await this.#modelExists(id))
      throw new NotFoundError(`id ${id} not found`);
  }
}
