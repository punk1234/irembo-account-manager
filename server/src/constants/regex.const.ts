/**
 * @const Regex
 * @description Common regular expressions
 * @property {RegExp} EMAIL
 * @property {RegExp} PASSWORD
 * @property {RegExp} UUID
 * @memberOf Constants
 */
export const Regex = {
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-z][a-z0-9.-]+[.][a-z]{2,5}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,30})/,
  UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  OBJECT_ID: /^[0-9a-f]{24}$/i,
};
