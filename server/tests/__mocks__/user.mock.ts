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

  static getValidUserUpdateData() {
    return {
      countryCode: "NG",
      firstName: "Fat",
      lastName: "Eye",
      gender: "MALE",
      dateOfBirth: "2001-01-01",
      maritalStatus: "SINGLE",
    };
  }

  static getProfileImageUrl() {
    return "http://res.cloudinary.com/dqaowgncy/image/upload/v1683201774/profile-photos/cb8c1893ccf749098844109474c45bea.png";
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

  static getValidEmail() {
    return "valid-email@irembo.com";
  }
}
