import { Service } from "typedi";

/**
 * @class CacheManager
 */
@Service()
export class CacheManager {
  data: Record<string, any> = {};

  /**
   * @method set
   * @instance
   * @param {string} key
   * @param {string} value
   */
  set(key: string, value: string) {
    return (this.data[key] = value);
  }

  /**
   * @method get
   * @instance
   * @param {string} key
   * @return {Promise<any>}
   */
  get(key: string): Promise<any> {
    return this.data[key];
  }

  /**
   * @method delete
   * @instance
   * @param {string} key
   */
  delete(key: string): Promise<any> {
    return new Promise((resolve: any) => {
      this.data[key] = undefined;
      resolve(true);
    });
  }
}
