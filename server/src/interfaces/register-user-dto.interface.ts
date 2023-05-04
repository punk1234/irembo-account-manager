import { RegisterUserDto } from "../models";

/**
 * @interface IRegisterUserDto
 */
export interface IRegisterUserDto extends RegisterUserDto {
  isAdmin?: boolean;
}
