import dotenv from "dotenv";
import mongoose, { ConnectOptions } from "mongoose";
import Database from "@app/utils/db/Database";

export type Options = ConnectOptions & {
  envFilePath?: string;
};

export default class RealMongoDatabase implements Database {
  #options: ConnectOptions;

  #dbConnectionURL: string;

  #initialized: boolean;

  #connected: boolean;

  #envFilePath?: string;

  protected connection: mongoose.Connection | null = null;

  constructor(options?: Options) {
    if (options) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { envFilePath: _, ...connectOptions } = options;

      this.#options = {
        ...connectOptions,
      };
    } else {
      this.#options = {
      };
    }

    this.#dbConnectionURL = "";
    this.#initialized = false;
    this.#connected = false;
    this.#envFilePath = options?.envFilePath;
  }

  init() {
    // mongoose options
    this.#options = {
      autoIndex: false,
      maxPoolSize: 10,
      ...this.#options,
    };

    this.#dbConnectionURL = this.generateUrl();

    this.#initialized = true;
  }

  #assertInitialized() {
    if (!this.#initialized)
      throw new Error("MongoDatabase not initialized");
  }

  #assertConnected() {
    if (!this.#connected)
      throw new Error("MongoDatabase not connected");
  }

  async connect() {
    this.#assertInitialized();
    console.log(`Connecting to ${this.#dbConnectionURL} ...`);
    mongoose.set("strictQuery", false);
    const connectPromise = mongoose.connect(this.#dbConnectionURL, this.#options);
    const { connection } = mongoose;

    connection.on("error", console.error.bind(console, `Mongodb Connection Error: ${this.#dbConnectionURL}\n`));
    connection.once("open", () => {
      console.log("Mongodb Connection Successful!");

      this.#connected = true;
    } );
    connection.once("close", () => {
      console.log("Mongodb Connection Closed!");

      this.#connected = false;
    } );

    this.connection = connection;

    await connectPromise;
  }

  async disconnect() {
    console.log("Disconnecting from mongodb ...");
    this.#assertConnected();
    await mongoose.disconnect();
  }

  // eslint-disable-next-line class-methods-use-this
  protected generateUrl() {
    if (this.#envFilePath) {
      dotenv.config( {
        path: this.#envFilePath,
      } );
    } else
      dotenv.config();

    // mongodb environment variables
    const { MONGO_HOSTNAME,
      MONGO_DB,
      MONGO_PORT,
      MONGO_USER,
      MONGO_PASSWORD } = process.env;
    const isLocal = MONGO_HOSTNAME === "localhost" || MONGO_HOSTNAME === "127.0.0.1" || MONGO_HOSTNAME === "db";
    let ret = `${isLocal ? "mongodb" : "mongodb+srv"}://`;

    if (MONGO_USER && MONGO_PASSWORD)
      ret += `${MONGO_USER}:${MONGO_PASSWORD}@`;

    ret += MONGO_HOSTNAME;

    if (MONGO_PORT)
      ret += `:${MONGO_PORT}`;

    ret += `/${MONGO_DB}`;

    return ret;
  }
}
