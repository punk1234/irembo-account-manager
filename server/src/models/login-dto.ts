/* tslint:disable */
/* eslint-disable */
/**
 * Irembo Account-Management Service
 * This service provides endpoints for all `account management` related interactions
 *
 * OpenAPI spec version: 1.0.0
 * Contact: fatai@mail.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
/**
 * 
 * @export
 * @interface LoginDto
 */
export interface LoginDto {
    /**
     * User's email
     * @type {string}
     * @memberof LoginDto
     */
    email: string;
    /**
     * User's password (if not provided, then login will use passwordless strategy where a login-link is sent to user's email)
     * @type {string}
     * @memberof LoginDto
     */
    password?: string;
}
