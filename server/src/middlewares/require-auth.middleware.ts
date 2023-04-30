import C from "../constants";
// import Container from "typedi";
import { verifyAuthToken } from "../helpers";
import { IAuthTokenPayload, IVerifyAuthOptions } from "../interfaces";
import { NextFunction, Request, Response } from "express";
// import { SessionService } from "../services/session.service";
import { UnauthorizedError } from "../exceptions";

// const sessionService = Container.get(SessionService);

/**
 * @function requireAuth
 * @param {IVerifyAuthOptions} opts
 * @returns {Function}
 */
export const requireAuth = (opts?: IVerifyAuthOptions) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authTokenPayload: IAuthTokenPayload = verifyAuthToken(req.headers);

      // const userAuthSessionId = await sessionService.getUserSession(authTokenPayload.userId);
      // if (authTokenPayload.sessionId !== userAuthSessionId) {
      //   throw new UnauthenticatedError(C.ResponseMessage.ERR_UNAUTHENTICATED);
      // }

      console.log(authTokenPayload);
      console.log(opts?.tokenType);
      if (opts?.tokenType !== authTokenPayload.type) {
        next(new UnauthorizedError(C.ResponseMessage.ERR_UNAUTHORIZED));
      }

      if (opts?.forAdmin === undefined || authTokenPayload.isAdmin === opts?.forAdmin) {
        req.auth = authTokenPayload;
        return next();
      }

      next(new UnauthorizedError(C.ResponseMessage.ERR_UNAUTHORIZED));
    } catch (err) {
      next(err);
    }
  };
};
