/**
 * @class FixtureMock
 */
export class FixtureMock {
  static getValidDataFormatToCreate() {
    return {
      homeTeamId: "abcd1234abcd1234abcd0001",
      awayTeamId: "abcd1234abcd1234abcd0002",
      commencesAt: new Date(Date.now() + 3_600_000),
    };
  }

  static getInvalidFixtureToCreate() {
    return {
      homeTeamId: 1,
      awayTeamId: 2,
      commencesAt: 12345,
    };
  }
}
