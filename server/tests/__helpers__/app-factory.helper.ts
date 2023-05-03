import express from "express";
import TestApp from "./test-app";

/**
 * @class AppFactory
 */
class AppFactory {
  static app: TestApp;

  /**
   * @method create
   * @static
   * @async
   * @returns {Promise<express.Application>}
   */
  static async create(): Promise<express.Application> {
    this.app = new TestApp(express(), Number(7002));
    await this.app.initialize();

    return this.app.engine;
  }

  /**
   * @method destroy
   * @static
   * @async
   */
  static async destroy(): Promise<void> {
    await this.app.close();
  }
}

export default AppFactory;
