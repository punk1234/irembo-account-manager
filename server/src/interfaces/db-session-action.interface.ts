import { ClientSession } from "mongoose";

/**
 * @interface IDbSessionAction
 */
export interface IDbSessionAction {
  (dbSession?: ClientSession): Promise<any>;
}
