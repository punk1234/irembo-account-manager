import { Service } from "typedi";
import { CacheManager } from "./managers/cache-manager.service";

@Service()
export class SessionService {
  private CACHE_NAMESPACE = "auth_session_:";

  // eslint-disable-next-line no-useless-constructor
  private cacheManager: CacheManager = new CacheManager();

  /**
   * @method registerSession
   * @instance
   * @param {string} userId
   * @param {string} sessionId
   * @return {Promise<any>}
   */
  registerSession(userId: string, sessionId: string): Promise<any> {
    return this.cacheManager.set(`${this.CACHE_NAMESPACE}${userId}`, sessionId);
  }

  /**
   * @method getUserSession
   * @instance
   * @param {string} userId
   * @return {Promise<string>}
   */
  getUserSession(userId: string): Promise<string> {
    return this.cacheManager.get(`${this.CACHE_NAMESPACE}${userId}`);
  }

  /**
   * @method invalidateSession
   * @instance
   * @param {string} userId
   * @return {Promise<any>}
   */
  invalidateSession(userId: string): Promise<any> {
    return this.cacheManager.delete(`${this.CACHE_NAMESPACE}${userId}`);
  }
}
