import { DateTimeCalculator } from "../../../src/helpers";

describe("Date Time Calculator", () => {
  describe("Next Date Time Calculator", () => {
    it("[PASS] Get dateTime in next specified valid hours & minutes", async () => {
      const calculatedDateTime: Date = DateTimeCalculator.getDateTimeInNext(6, 30);
      expect(calculatedDateTime).toBeDefined();
    });

    it("[PASS] Get dateTime in next specified valid hours (only)", async () => {
      const calculatedDateTime: Date = DateTimeCalculator.getDateTimeInNext(30);
      expect(calculatedDateTime).toBeDefined();
    });

    it("[FAIL] Get dateTime in next specified negative hours", async () => {
      const NEGATIVE_HOURS = -5;
      expect(() => DateTimeCalculator.getDateTimeInNext(NEGATIVE_HOURS))
        .toThrow("Hours cannot be negative");
    });
    });

    it("[FAIL] Get dateTime in next specified negative minutes", async () => {
      const HOURS = 7;
      const NEGATIVE_MINUTES = -3;
      expect(() => DateTimeCalculator.getDateTimeInNext(HOURS, NEGATIVE_MINUTES))
        .toThrow("Minutes cannot be negative");
    });
  });

  describe("Date Time Less Than Checker", () => {
    it("[PASS] Check that date is < current datetime with valid less than date", async () => {
      const DATE_TIME: Date = new Date(Date.now() - 1); // subtract one millisec
      const isLessThan: boolean = DateTimeCalculator.isLessThanCurrentTime(DATE_TIME);
      expect(isLessThan).toEqual(true);
    });

    it("[FAIL] Check that date is < current datetime with invalid date > now", async () => {
      const DATE_TIME: Date = new Date(Date.now() + 1000); // add 1000 millisec
      const isLessThan: boolean = DateTimeCalculator.isLessThanCurrentTime(DATE_TIME);
      expect(isLessThan).toEqual(false);
    });

  });
});
