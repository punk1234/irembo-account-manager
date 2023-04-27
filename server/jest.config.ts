/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */

// Bootstrap Test credentials
process.env.JWT_TOKEN_SECRET = "jwt_token_secret";

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFilesAfterEnv: ["./jest.setup.redis-mock.ts"],
};
