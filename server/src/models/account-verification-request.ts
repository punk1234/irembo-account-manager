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
import { IdentificationType } from './identification-type';
import { VerificationStatus } from './verification-status';
/**
 * 
 * @export
 * @interface AccountVerificationRequest
 */
export interface AccountVerificationRequest {
    /**
     * User identifier
     * @type {string}
     * @memberof AccountVerificationRequest
     */
    id?: string;
    /**
     * 
     * @type {IdentificationType}
     * @memberof AccountVerificationRequest
     */
    idType: IdentificationType;
    /**
     * Identification number of `idType`
     * @type {string}
     * @memberof AccountVerificationRequest
     */
    idNumber: string;
    /**
     * 
     * @type {Array<string>}
     * @memberof AccountVerificationRequest
     */
    images: Array<string>;
    /**
     * 
     * @type {VerificationStatus}
     * @memberof AccountVerificationRequest
     */
    status: VerificationStatus;
    /**
     * 
     * @type {Date}
     * @memberof AccountVerificationRequest
     */
    createdAt?: Date;
    /**
     * 
     * @type {Date}
     * @memberof AccountVerificationRequest
     */
    updatedAt?: Date;
}
