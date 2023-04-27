import { IDbSessionAction } from "../interfaces";
import { Mongoose, ClientSession } from "mongoose";

/**
 * @class DbTransactionHelper
 * @description This class helps handle group of operations with DB transaction
 */
export class DbTransactionHelper {
  private static client: Mongoose;

  /**
   * @method initialize
   * @param {mongoose.Mongoose} client
   * @memberOf DbTransactionHelper
   */
  static initialize(client: Mongoose) {
    DbTransactionHelper.client = client;
  }

  /**
   * @method execute
   * @param {IDbSessionAction} action
   * @returns {Promise<T>}
   * @memberOf DbTransactionHelper
   */
  static async execute<T>(action: IDbSessionAction): Promise<T> {
    if (!DbTransactionHelper.client) {
      throw new Error("Client not set. Please call initialize method to set client!");
    }

    const session: ClientSession = await DbTransactionHelper.client.startSession();

    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve: any, reject: any) => {
      try {
        await session.withTransaction(async () => {
          resolve(await action(session));
        });
      } catch (e: any) {
        const error: any = e.originalError || e;

        if (error.codeName === "IllegalOperation" && /replica set/i.test(error.errmsg)) {
          console.warn("Transactions not supported, using no transactions");
          resolve(action());
        }

        reject(error);
      } finally {
        session.endSession();
      }
    });
  }
}
