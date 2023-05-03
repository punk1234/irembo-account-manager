/**
 * @class TeamMock
 */
export class TeamMock {
  static getValidTeamToCreate() {
    return {
      name: "Team 1",
      code: "TM1",
    };
  }

  static getInvalidTeamToCreate() {
    return {
      name: "     ",
      code: " - ",
    };
  }

  static getTeams() {
    return [
      { name: "aBAB", code: "AB1" },
      { name: "BBAA", code: "BA2" },
      { name: "BBCC", code: "BC3" },
      { name: "ABAa", code: "AA4" },
    ];
  }
}
