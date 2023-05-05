/**
 * @class UserMock
 */
export class UserMock {
  static getValidUserToCreate() {
    return {
      email: "valid-email@email.com",
      password: "Abcd#1234",
      countryCode: "NG",
    };
  }

  private static getValidAdminToCreate() {
    return {
      email: "admin-email@email.com",
      password: "Abcd#1234",
      countryCode: true,
    };
  }

  static getValidUserDataToLogin() {
    return {
      ...this.getValidUserToCreate(),
      countryCode: undefined,
    };
  }

  static getValidAdminDataToLogin() {
    return {
      ...this.getValidAdminToCreate(),
      countryCode: undefined,
    };
  }

  static getInvalidUserToCreate() {
    return {
      email: "invalid-email.com",
      password: "ab",
      countryCode: "1",
    };
  }

  static getInvalidUserToLogin() {
    return {
      ...this.getInvalidUserToCreate(),
      countryCode: undefined,
    };
  }

  static getValidUserVerifyAccountToken() {
    return {
      value: "ABCD1234ABCD1234ABCD1234ABCD1234ABCD1234",
      encoded: "",
    };
  }
}
