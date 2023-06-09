import { Inject, Service } from "typedi";
import { ClientSession } from "mongoose";
import C from "../constants";
import config from "../config";
import { IFileUploadData, IPaginatedData, IRegisterUserDto } from "../interfaces";
import { IUser } from "../database/types/user.type";
import UserModel from "../database/models/user.model";
import { CountryManager, PasswordHasher, RateLimitManager } from "../helpers";
import { FileManager } from "./external/file-manager.service";
import { ChangePasswordDto, UpdateProfileDto, User } from "../models";
import { BadRequestError, ConflictError, NotFoundError, UnauthenticatedError } from "../exceptions";
import { SessionService } from "./session.service";

@Service()
export class UserService {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    @Inject() private readonly fileManager: FileManager,
    @Inject() private readonly sessionService: SessionService,
  ) {}

  /**
   * @method createUser
   * @async
   * @param {RegisterUserDto} data
   * @param {ClientSession} dbSession
   * @returns {Promise<IUser>}
   */
  async createUser(data: IRegisterUserDto, dbSession?: ClientSession): Promise<IUser> {
    const PASSWORD_HASH: string = PasswordHasher.hash(data.password);

    const USER = new UserModel({ ...data, password: PASSWORD_HASH, nationality: data.countryCode });

    return USER.save({ session: dbSession });
  }

  /**
   * @method updateProfile
   * @async
   * @param {string} userId
   * @param {UpdateProfileDto} data
   * @param {IFileUploadData} photoData
   * @returns {Promise<IUser>}
   */
  async updateProfile(
    userId: string,
    data: UpdateProfileDto,
    photoData?: IFileUploadData,
  ): Promise<IUser> {
    const updateData: Partial<User> = {};

    if (data.nationality) {
      if (!CountryManager.getNameByCode(data.nationality)) {
        throw new BadRequestError("Invalid country!");
      }

      updateData.nationality = data.nationality;
    }

    data.firstName && (updateData.firstName = data.firstName);
    data.lastName && (updateData.lastName = data.lastName);

    data.gender && (updateData.gender = data.gender);
    data.dateOfBirth && (updateData.dateOfBirth = data.dateOfBirth); // TODO: HANDLE CONSTRAINT MINIMUM AGE CONSTRAINT
    data.maritalStatus && (updateData.maritalStatus = data.maritalStatus);

    if (photoData) {
      const photoUrl = await this.fileManager.uploadFile(photoData, config.PROFILE_PHOTO_BUCKET);
      updateData.photoUrl = photoUrl;
    }

    const USER = await UserModel.findOneAndUpdate({ _id: userId }, updateData, { new: true });

    if (USER) {
      return USER;
    }

    throw new NotFoundError("User not found!");
  }

  /**
   * @method changePassword
   * @async
   * @param {string} userId
   * @param {ChangePasswordDto} data
   * @returns {Promise<IUser>}
   */
  async changePassword(userId: string, data: ChangePasswordDto): Promise<IUser> {
    const USER = await this.checkThatUserExist(userId);
    this.checkThatPasswordsMatch(data.password, USER.password as string);

    RateLimitManager.reset(userId, C.ApiRateLimiterType.CHANGE_PASSWORD).catch();

    USER.password = PasswordHasher.hash(data.newPassword);
    await this.sessionService.invalidateSession(userId);

    return USER.save();
  }

  /**
   * @method updatePassword
   * @async
   * @param {string} userId
   * @param {string} plainTextPassword
   * @returns {Promise<void>}
   */
  async updatePassword(userId: string, plainTextPassword: string): Promise<void> {
    // TODO: DESTROY SESSION AUTH-TOKEN IN CACHE
    await UserModel.updateOne(
      { _id: userId },
      { password: PasswordHasher.hash(plainTextPassword) },
    );
  }

  /**
   * @method markUserAsActive
   * @async
   * @param {string} userId
   * @param {ClientSession} dbSession
   * @returns {Promise<void>}
   */
  async markUserAsActive(userId: string, dbSession?: ClientSession): Promise<void> {
    await UserModel.updateOne({ _id: userId }, { active: true }, { session: dbSession });
  }

  /**
   * @method getUsers
   * @instance
   * @param {Record<string, any>} filter
   * @returns {Promise<IPaginatedData<IUser>>}
   */
  getUsers(filter: Record<string, any>): Promise<IPaginatedData<IUser>> {
    const { page = 1, limit = 10 } = filter;

    return UserModel.find().sort({ email: 1 }).paginate({ page, limit });
  }

  /**
   * @method setVerifiedValue
   * @async
   * @param {string} userId
   * @param {boolean} verified
   */
  async setVerifiedValue(userId: string, verified: boolean = false): Promise<void> {
    const result = await UserModel.updateOne({ _id: userId }, { verified });

    if (!result.matchedCount) {
      throw new NotFoundError("User not found!");
    }
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
