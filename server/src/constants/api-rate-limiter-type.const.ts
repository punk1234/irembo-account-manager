/**
 * @enum ApiRateLimiterType
 */
export enum ApiRateLimiterType {
  AUTH_LOGIN = "auth_login",
  CHANGE_PASSWORD = "chg_pwd",
  GENERATE_RESET_TOKEN = "gen_rst_tkn",
  RESET_PASSWORD = "rst_pwd",
  VERIFY_2FA = "vrf_2fa",
  VERIFY_ACCOUNT = "vrf_act",
  VERIFY_RESET_TOKEN = "vrf_rst_tkn",
}
