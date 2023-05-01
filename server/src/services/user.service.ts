import { Service } from "typedi";
import C from "../constants";
import { PasswordHasher } from "../helpers";
import { RegisterUserDto } from "../models";
import { IUser } from "../database/types/user.type";
import UserModel from "../database/models/user.model";
import { ConflictError, NotFoundError, UnauthenticatedError } from "../exceptions";
import { ClientSession } from "mongoose";

@Service()
export class UserService {
  /**
   * @method createUser
   * @async
   * @param {RegisterUserDto} data
   * @param {ClientSession} dbSession
   * @returns {Promise<IUser>}
   */
  async createUser(data: RegisterUserDto, dbSession?: ClientSession): Promise<IUser> {
    const PASSWORD_HASH: string = PasswordHasher.hash(data.password);

    const USER = new UserModel({ ...data, password: PASSWORD_HASH, nationality: data.countryCode });

    return USER.save({ session: dbSession });
  }

  /**
   * @method checkThatUserExist
   * @async
   * @param {string} userId
   * @returns {Promise<IUser>}
   */
  async checkThatUserExist(userId: string): Promise<IUser> {
    const foundUser = await UserModel.findOne({ _id: userId });
    if (foundUser) {
      return foundUser;
    }

    throw new NotFoundError("User not found!");
  }

  /**
   * @method checkThatUserEmailExist
   * @async
   * @param {string} email
   * @returns {Promise<IUser>}
   */
  async checkThatUserEmailExist(email: string): Promise<IUser> {
    const foundUser = await this.getUserByEmail(email);
    if (foundUser) {
      return foundUser;
    }

    throw new NotFoundError("User not found!");
  }

  /**
   * @method getUserByEmail
   * @async
   * @param {string} email
   * @returns {Promise<IUser|null>}
   */
  async getUserByEmail(email: string): Promise<IUser | null> {
    return UserModel.findOne({ email });
  }

  /**
   * @method checkThatUserWithEmailDoesNotExist
   * @async
   * @param {string} email
   */
  async checkThatUserWithEmailDoesNotExist(email: string): Promise<void> {
    const foundUser = await UserModel.findOne({ email });

    if (foundUser) {
      throw new ConflictError("User already exist!");
    }
  }

  /**
   * @method checkThatPasswordsMatch
   * @instance
   * @param {string} plainTextPassword
   * @param {string} passwordHash
   */
  checkThatPasswordsMatch(plainTextPassword: string, passwordHash: string): void {
    const VALID_PASSWORD = PasswordHasher.verify(plainTextPassword, passwordHash);

    if (!VALID_PASSWORD) {
      throw new UnauthenticatedError(C.ResponseMessage.ERR_INVALID_CREDENTIALS);
    }
  }
}
