import { Mongoose } from "mongoose";
import { DbTransactionHelper } from "../../helpers";
import { IDatabaseConnector } from "../../interfaces";

/**
 * @class MongoDbConnector
 * @implements IDatabaseConnector
 */
export default class MongoDbConnector implements IDatabaseConnector {
  protected static client: any;
  private readonly mongoose: Mongoose;

  constructor(mongoose: Mongoose) {
    this.mongoose = mongoose;
  }

  /**
   * @method getClient
   * @static
   * @memberof MongoDbConnector
   * @returns {*}
   */
  static getClient() {
    return this.client;
  }

  /**
   * @method connect
   * @desc connects to mongodb database
   * @instance
   * @param {string} url
   * @memberof MongoDbConnector
   */
  async connect(url: string) {
    MongoDbConnector.client = await this.mongoose.connect(url);
    DbTransactionHelper.initialize(this.mongoose);
  }

  /**
   * @method disconnect
   * @desc disconnects from mongodb database
   * @async
   * @instance
   * @memberof MongoDbConnector
   */
  async disconnect() {
    await MongoDbConnector.client?.disconnect();
  }
}
