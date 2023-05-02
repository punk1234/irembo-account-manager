/**
 * @enum ApiRateLimiterType
 */
export enum ApiRateLimiterType {
  AUTH_LOGIN = "auth_login",

  /** NOTE: CAN ALSO SCALE FOR BELOW FEATURES */
  CHANGE_PASSWORD = "chg_pwd",
  GENERATE_RESET_TOKEN = "gen_rst_tkn",
  // VERIFY_RESET_TOKEN = "vrf_rst_tkn",
  RESET_PASSWORD = "rst_pwd",
}
