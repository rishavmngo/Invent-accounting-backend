import { Response } from "express";

export enum ErrorCode {
  INVALID_CREDENTIALS = "AUTH_001",
  SESSION_EXPIRED = "AUTH_002",
  USER_ALREADY_EXIST = "AUTH_003",
  UNEXPECTED_ERROR = "AUTH_004",
  USER_NOT_FOUND = "AUTH_005",
  WRONG_CREDENTIALS = "AUTH_006",
}
export enum SuccessCode {
  LOGIN_SUCCESS = "SUCCESS_001",
  REGISTRATION_SUCCESS = "SUCCESS_002",
}

export const sendSuccess = <T>(
  res: Response,
  data: T = null as T,
  message = "Operation successful",
  code = SuccessCode.LOGIN_SUCCESS,
  statusCode = 200,
) => {
  return res.status(statusCode).json({
    success: true,
    code,
    message,
    data,
  });
};

// Error response helper
export const sendError = (
  res: Response,
  message = "Operation failed",
  code = ErrorCode.INVALID_CREDENTIALS,
  statusCode = 400,
  data = null,
) => {
  return res.status(statusCode).json({
    success: false,
    code,
    message,
    data,
  });
};
