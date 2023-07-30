import { assertDefined } from "@app/utils";
import CanSimpleCrud from "@app/utils/controllers/interfaces/CanSimpleCrud";
import HttpError from "@app/utils/models/repositories/errors/HttpError";
import NotFoundError from "@app/utils/models/repositories/errors/NotFoundError";
import { Request, Response } from "express";
import { Repository } from "./repositories";

type Dependencies = {
  repository: Repository;
};
export default class TodoController
implements CanSimpleCrud<Request, Response> {
  readonly #repository: Repository;

  constructor(dependencies: Dependencies) {
    this.#repository = dependencies.repository;

    if (!this.#repository)
      throw new Error("Controller requires Repository");
  }

  async getOneById(req: Request, res: Response) {
    const { id } = req.params;

    assertDefined(id);
    try {
      const got = await this.#repository.getOneById(id);

      if (!got)
        throw new NotFoundError(`id ${id} not found`);

      res
        .status(200)
        .send(got);
    } catch (e) {
      this.#handleError(e, res);
    }
  }

  async createOne(req: Request, res: Response) {
    const { body } = req;

    assertDefined(body);
    try {
      await this.#repository.createOne(body);
      res.sendStatus(201);
    } catch (e) {
      this.#handleError(e, res);
    }
  }

  #handleError(e: unknown, res: Response) {
    if (e instanceof HttpError)
      res.sendStatus(e.code);
    else {
      res.sendStatus(500);

      if (process.env.NODE_ENV === "development")
        throw e;
    }
  }

  async updateOneById(req: Request, res: Response) {
    const { id } = req.params;

    assertDefined(id);

    const { body } = req;

    try {
      await this.#repository.updateOneById(id, body);
      res.sendStatus(200);
    } catch (e) {
      this.#handleError(e, res);
    }
  }

  async deleteOneById(req: any, res: any) {
    const { id } = req.params;

    assertDefined(id);
    try {
      await this.#repository.deleteOneById(id);

      res.sendStatus(200);
    } catch (e) {
      this.#handleError(e, res);
    }
  }
}
