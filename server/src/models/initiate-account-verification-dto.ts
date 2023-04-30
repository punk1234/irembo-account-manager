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
/**
 * 
 * @export
 * @interface InitiateAccountVerificationDto
 */
export interface InitiateAccountVerificationDto {
    /**
     * 
     * @type {IdentificationType}
     * @memberof InitiateAccountVerificationDto
     */
    idType: IdentificationType;
    /**
     * Identification number of `idType`
     * @type {string}
     * @memberof InitiateAccountVerificationDto
     */
    idNumber: string;
    /**
     * 
     * @type {Array<Blob>}
     * @memberof InitiateAccountVerificationDto
     */
    images: Array<Blob>;
}