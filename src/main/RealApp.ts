import { LabelCachingService } from "@app/modules/label";
import { TodoRepository, TodoRouter } from "@app/modules/todo";
import { connect } from "@app/utils/models/db/database";
import express, { Request, Response } from "express";
import App from "./App";

type Dependencies = {
  todo: {
    repository: TodoRepository;
  },
  label: {
    cachingService: LabelCachingService | null;
  }
  db?: {
    useDB?: boolean;
  }
};

// Necesario para poder replicarla para test
export default class RealApp implements App<express.Express> {
  #instance: express.Express;

  constructor(dependencies: Dependencies) {
    if (dependencies.db?.useDB)
      connect();

    dependencies.label.cachingService?.initCron();

    const app = express();

    app.disable("x-powered-by");

    if (process.env.NODE_ENV === "development") {
      app.get("/", (req: Request, res: Response) => {
        res.send("Hello World!");
      } );
    }

    const router = new TodoRouter( {
      repository: dependencies.todo.repository,
    } );

    app.use("/api/todos", router.getInnerInstance());

    this.#instance = app;
  }

  listen(): void {
    const PORT = process.env.NODE_ENV === "development" ? 1234 : 8080;
    const listener = this.#instance.listen(PORT, () => {
      const address = listener.address();
      let realPort = PORT;

      if (address && typeof address !== "string")
        realPort = address.port;

      console.log(`Server Listening on http://localhost:${realPort}`);
    } );
  }

  getInnerInstance(): express.Express {
    return this.#instance;
  }
}
