/**
 * @class EncodingChecker
 */
class EncodingChecker {
  /**
   * @name isBase32
   * @param value
   * @returns
   */
  static isBase32(value: string) {
    const regex = /^([A-Z2-7=]{8})+$/;
    return regex.test(value);
  }

  /**
   * @name containsBase32Chars
   * @param value
   * @returns
   */
  static containsBase32Chars(value: string) {
    const regex = /^([A-Z2-7=])+$/;
    return regex.test(value);
  }
}

export default EncodingChecker;
