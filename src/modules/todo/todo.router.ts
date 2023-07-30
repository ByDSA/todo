
import IRouter from "@app/utils/routers/IRouter";
import cors from "cors";
import express from "express";
import { Repository } from "./repositories";
import TodoController from "./todo.controller";

type Dependencies = {
  repository: Repository;
};
export default class Router implements IRouter<express.Router> {
  readonly #router: express.Router;

  constructor(dependencies: Dependencies) {
    const router = express.Router();
    const repo = dependencies.repository;
    const controller = new TodoController( {
      repository: repo,
    } );

    router.use(express.json()); // Parse request body as JSON

    router.use(cors( {
      origin: "http://localhost:8082", // Swagger UI
    } ));
    router.post("/", controller.createOne.bind(controller));
    router.get("/:id", controller.getOneById.bind(controller));
    router.patch("/:id", controller.updateOneById.bind(controller));
    router.delete("/:id", controller.deleteOneById.bind(controller));

    this.#router = router;
  }

  getInnerInstance(): express.Router {
    return this.#router;
  }
}
