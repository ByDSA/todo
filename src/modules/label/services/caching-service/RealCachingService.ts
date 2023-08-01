/* eslint-disable class-methods-use-this */
import cron from "node-cron";
import { Repository } from "../../repositories";
import CachingService from "./CachingService";
import ExternalLabel, { externalToInnerModel } from "./ExternalLabel.model";

const URL = "https://nptwpxthvb.eu-west-1.awsapprunner.com/labels";

type Dependencies = {
  repository: Repository;
};

export default class RealCachingService implements CachingService {
  #updatingCache: boolean = false;

  #repository: Repository;

  constructor(dependencies: Dependencies) {
    this.#repository = dependencies.repository;
  }

  init() {
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
    let success = false;
    const receivedData = await this.fetchData();
    const isReceivedData = receivedData.length > 0;

    if (isReceivedData)
      success = await this.#updateDatabase(receivedData);

    if (success)
      console.log(new Date(), "Updated Label cache with", receivedData);
    else
      console.log(new Date(), "Failed to update Label cache with", receivedData);

    this.#updatingCache = false;

    return success;
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

  protected async fetchData() {
    const ret = await fetch(URL, {
      signal: AbortSignal.timeout(10 * 1000), // Timeout = 10s
    } ).then((res) => res.json())
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .catch((_) => []);

    return ret;
  }
}
