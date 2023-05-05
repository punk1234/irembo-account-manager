import "reflect-metadata";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import mongoose, { Schema } from "mongoose";
import compression from "compression";
import cookieParser from "cookie-parser";
import express, { Application } from "express";

import C from "./constants";
import config from "./config";
import { errorHandler } from "./middlewares";
import { BadRequestError } from "./exceptions";
import { Logger, LoggerStream } from "./helpers";
import { MongooseUuid } from "./database/mongoose-uuid.type";
import { IAppOptions, IDatabaseConnector } from "./interfaces";
import RedisConnector from "./database/connectors/redis.connector";
import MongoDbConnector from "./database/connectors/mongodb.connector";

// Add MongooseUuid to SchemaTypes before loading the routes,
// loading the routes will instantiate models, so UUID types must be added before models are instantiated
(Schema.Types as any).UUID = MongooseUuid;

import RouteManager from "./routes";
import { runDbSeeders } from "./database/seeders";

/**
 * @class App
 */
export default class App {
  readonly engine: Application;
  readonly port: number;
  readonly inProduction: boolean;

  options: IAppOptions;
  connection: any;

  protected mongoConnector!: IDatabaseConnector;
  protected redisConnector!: IDatabaseConnector;

  /**
   * @constructor
   *
   * @param {Application} engine
   * @param {number} port
   * @param {IAppOptions} options
   */
  constructor(engine: Application, port: number, options?: IAppOptions) {
    this.engine = engine;
    this.port = port;
    this.options = options || {};
    this.inProduction = process.env.NODE_ENV === C.Environment.PRODUCTION;
  }

  /**
   * @method setupDependencies
   * @async
   * @instance
   */
  protected async setupDependencies(): Promise<void> {
    this.mongoConnector = new MongoDbConnector(mongoose);
    this.redisConnector = new RedisConnector();

    await Promise.all([
      this.mongoConnector.connect(config.MONGODB_URL),
      this.redisConnector.connect(config.REDIS_URL),
    ]);

    await runDbSeeders();
  }

  /**
   * @method checkDependencies
   * @instance
   */
  checkDependencies(): void {
    if (!MongoDbConnector.getClient()) {
      throw new Error("Initialize DB!!!");
    }
  }

  /**
   * @method configure
   * @instance
   */
  protected configure(): void {
    const {
      urlEncodeExtended = true,
      requestSizeLimit = "20mb",
      compression: compressionOption,
      cors: corsOption,
      errors: errorOption,
    } = this.options;

    this.engine.use(helmet());
    this.engine.use(helmet.hidePoweredBy());
    this.engine.use(cookieParser());
    this.engine.use(cors(corsOption));
    this.engine.use(compression(compressionOption));
    this.engine.use(express.json({ limit: requestSizeLimit }));

    this.engine.use((err: any, _req: any, _res: any, next: any) => {
      if (err instanceof SyntaxError && "body" in err) {
        throw new BadRequestError("Invalid request body");
      }

      next();
    });

    this.engine.use(express.urlencoded({ limit: requestSizeLimit, extended: urlEncodeExtended }));
    this.engine.use(morgan("combined", { stream: LoggerStream }));

    RouteManager.installRoutes(this.engine);

    this.engine.use(errorHandler(errorOption?.includeStackTrace || !this.inProduction));
  }

  /**
   * @initialize
   * @async
   * @instance
   */
  async initialize(): Promise<void> {
    await this.setupDependencies();

    this.configure();
  }

  /**
   * @method run
   * @instance
   */
  run(): void {
    this.connection = this.engine.listen(this.port, () => {
      Logger.info(`App now running on port ${this.port}`);
    });
  }

  /**
   * @method close
   * @instance
   * @async
   * @param {boolean} closeDataStores
   */
  async close(closeDataStores: boolean = true) {
    this.connection?.close();

    if (closeDataStores) {
      await Promise.all([this.mongoConnector.disconnect(), this.redisConnector.disconnect()]);
    }
  }
}
