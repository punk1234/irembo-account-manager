import moment, { Moment } from "moment";

/**
 * @class DateTimeCalculator
 */
export class DateTimeCalculator {
  /**
   * @name getDateTimeInNext
   * @static
   * @param {number} hours
   * @param {number} minutes
   * @returns {Date}
   */
  static getDateTimeInNext(hours: number, minutes: number = 0): Date {
    this.checkThatHourAndMinutesAreValid(hours, minutes);
    const calculatedDate: Moment = moment().add(hours, "hours");
    calculatedDate.add(minutes, "minutes");

    return calculatedDate.toDate();
  }

  /**
   * @name isLessThanCurrentTime
   * @static
   * @param {Date} givenDateTime
   * @returns {boolean}
   */
  static isLessThanCurrentTime(givenDateTime: Date): boolean {
    return givenDateTime.getTime() < Date.now();
  }

  /**
   * @name checkThatHourAndMinutesAreValid
   * @static
   * @param {number} hours
   * @param {number} minutes
   */
  private static checkThatHourAndMinutesAreValid(hours: number, minutes: number): void {
    if (hours < 0) {
      throw new Error("Hours cannot be negative");
    }

    if (minutes < 0) {
      throw new Error("Minutes cannot be negative");
    }
  }
}
