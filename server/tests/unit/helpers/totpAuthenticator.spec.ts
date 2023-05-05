import config from "../../../src/config";
import { TotpAuthenticator } from "../../../src/helpers";
import EncodingChecker from "../../__helpers__/encoding-checker.helper";
import { UserMock } from "../../__mocks__";

describe("Totp Authenticator", () => {
  describe("Totp Authenticator - getSecret", () => {
    it("[PASS] Secret should have base32 characters", async () => {
      const totpSecret: string = TotpAuthenticator.getSecret();
      expect(totpSecret).toBeDefined();
      expect(EncodingChecker.containsBase32Chars(totpSecret)).toEqual(true);
    });

  });

  describe("Totp Authenticator - verify", () => {
    it("[PASS] Verify with valid secret & twoFaCode", async () => {
      const totpSecret: string = TotpAuthenticator.getSecret();
      const twoFaCode: string = TotpAuthenticator.getTotpCode(totpSecret);
      const isValid: boolean = TotpAuthenticator.verify(totpSecret, twoFaCode);
      expect(isValid).toEqual(true);
    });

    it("[PASS] Verify with valid secret & invalid twoFaCode", async () => {
      const totpSecret: string = TotpAuthenticator.getSecret();
      const twoFaCode = "000000";
      const isValid: boolean = TotpAuthenticator.verify(totpSecret, twoFaCode);
      expect(isValid).toEqual(false);
    });

    it("[PASS] Verify with invalid secret", async () => {
      const totpSecret: string = TotpAuthenticator.getSecret();
      const twoFaCode: string = TotpAuthenticator.getTotpCode(totpSecret);
      const INVALID_SECRET = `${totpSecret}@123`;
      const isValid: boolean = TotpAuthenticator.verify(INVALID_SECRET, twoFaCode);
      expect(isValid).toEqual(false);
    });

  });

  describe("Totp Authenticator - getQrCode", () => {
    it("[PASS] getQrCode with valid email & secret", async () => {
      const email = UserMock.getValidEmail();
      const totpSecret: string = TotpAuthenticator.getSecret();
      const qrcode: string = TotpAuthenticator.getQrCode(totpSecret, email);
      const expectedURL = `otpauth://totp/${email}?secret=${totpSecret}&issuer=${config.TOTP_ISSUER_NAME}`;
      expect(qrcode).toEqual(expectedURL);
    });

    it("[PASS] getQrCode with valid email, secret & issuer", async () => {
      const issuerName = "Awesome App v1";
      const email = UserMock.getValidEmail();
      const totpSecret: string = TotpAuthenticator.getSecret();
      const qrcode: string = TotpAuthenticator.getQrCode(totpSecret, email, issuerName);
      const expectedURL = `otpauth://totp/${email}?secret=${totpSecret}&issuer=${issuerName}`;
      expect(qrcode).toEqual(expectedURL);
    });

    it("[PASS] getQrCode with valid invalid secret", async () => {
      const email = UserMock.getValidEmail();
      const INVALID_SECRET = "";
      expect(() => TotpAuthenticator.getQrCode(INVALID_SECRET, email))
        .toThrow("Secret must have a valid value");
    });
    });
  });
});
