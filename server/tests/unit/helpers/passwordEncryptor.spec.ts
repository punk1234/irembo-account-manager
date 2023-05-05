import { PasswordHasher } from "../../../src/helpers";

describe("Password Encryptor", () => {
  describe("Password Encryptor - hash", () => {
    it("[PASS] Get password hash with valid plainPassword", async () => {
      const hashedPassword: string = PasswordHasher.hash("p@ssword");
      expect(hashedPassword).toBeDefined();
    });

    it("[FAIL] Get password hash with empty string plainPassword", async () => {
      expect(() => PasswordHasher.hash("")).toThrow("Invalid plain-text password");
    });
  });

  describe("Password Encryptor - verify", () => {
    it("[PASS] Verify password with valid hash", async () => {
      const PLAIN_PASSWORD = "p@ssword";
      const hashedPassword: string = PasswordHasher.hash(PLAIN_PASSWORD);
      const isValid: boolean = PasswordHasher.verify(PLAIN_PASSWORD, hashedPassword);
      expect(isValid).toEqual(true);
    });

    it("[FAIL] Verify hash with wrong password", async () => {
      const PLAIN_PASSWORD = "p@ssword";
      const WRONG_PASSWORD = PLAIN_PASSWORD + "@wrong";
      const hashedPassword: string = PasswordHasher.hash(PLAIN_PASSWORD);
      const isValid: boolean = PasswordHasher.verify(WRONG_PASSWORD, hashedPassword);
      expect(isValid).toEqual(false);
    });
  });
});
