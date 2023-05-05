/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */

// Bootstrap Test credentials
process.env.JWT_TOKEN_SECRET = "jwt_token_secret";
process.env.SUPER_ADMIN_EMAIL = "irembo-admin@email.com";
process.env.SUPER_ADMIN_PASSWORD = "Irembo@Admin#123";

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFilesAfterEnv: ["./jest.setup.redis-mock.ts"],
};
