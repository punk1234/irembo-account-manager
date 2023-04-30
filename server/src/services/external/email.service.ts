import Mailer, { Transporter } from "nodemailer";
import { Service } from "typedi";
import config from "../../config";
import { Logger } from "../../helpers";

/**
 * @class EmailService
 */
@Service()
export class EmailService {
  transporter: Transporter;
  SENDER_EMAIL: string;

  MAIL_FROM_NAME = "Irembo";

  /**
   * @constructor
   *
   * @param {string} SENDER_EMAIL
   * @param {string} SENDER_PASSWORD
   */
  constructor(
    SENDER_EMAIL: string = config.EMAIL_NAME,
    SENDER_PASSWORD: string = config.EMAIL_PASSWORD,
  ) {
    const AUTH = {
      user: SENDER_EMAIL,
      pass: SENDER_PASSWORD,
    };

    this.transporter = Mailer.createTransport({ service: "gmail", auth: AUTH });
    this.SENDER_EMAIL = SENDER_EMAIL;
  }

  /**
   * @method send
   * @instance
   * @param {string} toEmail
   * @param {string} subject
   * @param {string} message
   */
  private send(toEmail: string, subject: string, message: string): void {
    const FROM_MAIL_INFO = {
      name: this.MAIL_FROM_NAME,
      address: this.SENDER_EMAIL,
    };

    this.transporter
      .sendMail({
        from: FROM_MAIL_INFO,
        to: toEmail,
        subject,
        text: message,
      })
      .catch(Logger.error);
  }

  sendPasswordlessLoginLink(toEmail: string, loginLink: string, name?: string): void {
    this.send(
      toEmail,
      "Irembo Account-Manager Passwordless Login",
      `Hi ${name || "@user"},
       Kindly login using ${loginLink}.
       Thanks.`,
    );
  }

  sendPasswordResetLink(toEmail: string, resetLink: string, name?: string): void {
    this.send(
      toEmail,
      "Irembo Account-Manager Password Reset",
      `Hi ${name || "@user"},
       Kindly use ${resetLink} to reset password.
       Thanks.`,
    );
  }
}
