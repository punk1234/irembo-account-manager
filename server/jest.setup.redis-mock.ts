// jest.mock('ioredis', () => jest.requireActual('redis-mock'));
jest.mock("ioredis", () => jest.requireActual("ioredis-mock"));

jest.mock("./src/services/managers/cache-manager.service", () =>
  jest.requireActual("./tests/__mocks__/cache-manager.mock"),
);
