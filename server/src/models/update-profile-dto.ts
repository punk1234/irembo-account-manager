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
import { Gender } from './gender';
import { MaritalStatus } from './marital-status';
/**
 * 
 * @export
 * @interface UpdateProfileDto
 */
export interface UpdateProfileDto {
    /**
     * User's first-name
     * @type {string}
     * @memberof UpdateProfileDto
     */
    firstName?: string;
    /**
     * User's last-name
     * @type {string}
     * @memberof UpdateProfileDto
     */
    lastName?: string;
    /**
     * User's country code (alpha2-code)
     * @type {string}
     * @memberof UpdateProfileDto
     */
    nationality?: string;
    /**
     * User's image
     * @type {Blob}
     * @memberof UpdateProfileDto
     */
    photo?: Blob;
    /**
     * 
     * @type {Gender}
     * @memberof UpdateProfileDto
     */
    gender?: Gender;
    /**
     * User's date of birth
     * @type {string}
     * @memberof UpdateProfileDto
     */
    dateOfBirth?: string;
    /**
     * 
     * @type {MaritalStatus}
     * @memberof UpdateProfileDto
     */
    maritalStatus?: MaritalStatus;
}
