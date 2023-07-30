/* eslint-disable class-methods-use-this */
import cron from "node-cron";
import { Repository } from "../repositories";
import CachingService from "./CachingService";
import { ExternalLabel, externalToInnerModel } from "./ExternalLabel.model";

const URL = "https://nptwpxthvb.eu-west-1.awsapprunner.com/labels";

type Dependencies = {
  repository: Repository;
};

export default class CachingServiceReal implements CachingService {
  #updatingCache: boolean = false;

  #repository: Repository;

  constructor(dependencies: Dependencies) {
    this.#repository = dependencies.repository;
  }

  initCron() {
    console.log("Init CachingService cron");

    cron.schedule("*/15 * * * *", async () => {
      if (this.#updatingCache)
        return;

      await this.#updateCacheAndRetryIfFails();
    } );

    this.#updateCacheAndRetryIfFails();
  }

  async #updateCacheAndRetryIfFails() {
    const done = await this.updateCache();

    if (!done) {
      setTimeout(
        this.#updateCacheAndRetryIfFails.bind(this),
        10 * 1000,
      );
    } else
      this.#updatingCache = false;
  }

  async updateCache() {
    this.#updatingCache = true;
    const data = await fetchData();
    const received = data.length > 0;
    let done = false;

    if (received)
      done = await this.#updateDatabase(data);

    if (done)
      console.log(new Date(), "Updated Label cache with", data);

    this.#updatingCache = false;

    return done;
  }

  async #updateDatabase(receivedLabels: ExternalLabel[]) {
    try {
      await this.#repository.deleteAll();

      const newLabels = receivedLabels.map(externalToInnerModel);

      await this.#repository.createMany(newLabels);

      return true;
    } catch (e) {
      console.error(e);

      return false;
    }
  }
}

async function fetchData() {
  const ret = await fetch(URL).then((res) => res.json())
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .catch((_) => []);

  return ret;
}
