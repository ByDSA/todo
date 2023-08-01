import express, { Request, Response } from "express";
import helmet from "helmet";
import { LabelCachingService } from "@app/modules/label";
import { TODO_ENDPOINT_URL, TodoRepository, TodoRouter } from "@app/modules/todo";
import { assertDefined } from "@app/utils";
import Database from "@app/utils/db/Database";
import App from "./App";

type Dependencies = {
  todo: {
    repository: TodoRepository;
  },
  label: {
    cachingService: LabelCachingService | null;
  }
  db?: {
    instance: Database | null | undefined;
  }
};

// Necesario para poder replicarla para test
export default class ExpressApp implements App<express.Express> {
  #instance: express.Express | null = null;

  #database: Database | null = null;

  #cachingService: LabelCachingService | null;

  #todoRepository: TodoRepository;

  constructor(dependencies: Dependencies) {
    this.#database = dependencies.db?.instance ?? null;

    this.#cachingService = dependencies.label.cachingService ?? null;

    this.#todoRepository = dependencies.todo.repository;
  }

  async init() {
    if (this.#database) {
      this.#database.init();
      await this.#database.connect();
    }

    this.#cachingService?.init();

    const app = express();

    app.disable("x-powered-by");

    app.use(helmet());

    if (process.env.NODE_ENV === "development") {
      app.get("/", (req: Request, res: Response) => {
        res.send("Hello World!");
      } );
    }

    const router = new TodoRouter( {
      repository: this.#todoRepository,
    } );

    app.use(TODO_ENDPOINT_URL, router.getInnerInstance());

    this.#instance = app;
  }

  async close() {
    await this.#database?.disconnect();
  }

  listen() {
    assertDefined(this.#instance);
    const PORT = process.env.NODE_ENV === "development" ? 1234 : 8080;
    const listener = this.#instance.listen(PORT, () => {
      const address = listener.address();
      let realPort = PORT;

      if (address && typeof address !== "string")
        realPort = address.port;

      console.log(`Server Listening on http://localhost:${realPort}`);
    } );
  }

  getInnerInstance(): express.Express | null {
    return this.#instance;
  }
}
