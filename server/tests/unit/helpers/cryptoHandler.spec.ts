import { CryptoHandler } from "../../../src/helpers";
import { ICryptoData } from "../../../src/interfaces";

describe("Crypto Handler", () => {
  describe("Crypto Handler - encrypt", () => {
    it("[PASS] Encrypt text with valid input", async () => {
      const cryptoData: ICryptoData = CryptoHandler.encrypt("abcde12345");
      expect(cryptoData.content).toBeDefined();
      expect(cryptoData.iv).toBeDefined();
    });

    it("[FAIL] Encrypt text with invalid input (empty string)", async () => {
      expect(() => CryptoHandler.encrypt("")).toThrow("Invalid input");
    });
  });

  describe("Crypto Handler - decrypt", () => {
    it("[PASS] Decrypt text with valid input", async () => {
      const PLAIN_TEXT = "abcde12345";
      const cryptoData: ICryptoData = CryptoHandler.encrypt(PLAIN_TEXT);
      const decryptedText = CryptoHandler.decrypt(cryptoData);

      expect(PLAIN_TEXT).toEqual(decryptedText);
    });

    it("[FAIL] Decrypt with invalid input", async () => {
      const data: ICryptoData = { content: "", iv: "" };
      expect(() => CryptoHandler.decrypt(data)).toThrow();
    });
  });
});
