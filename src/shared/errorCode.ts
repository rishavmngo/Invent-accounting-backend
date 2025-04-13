import { Response } from "express";

export enum ErrorCode {
  INVALID_CREDENTIALS = "AUTH_001",
  SESSION_EXPIRED = "AUTH_002",
  USER_ALREADY_EXIST = "AUTH_003",
  WRONG_CREDENTIALS = "AUTH_004",
  UNEXPECTED_ERROR = "UNEXPECTED_ERROR",
  VALIDATION_ERROR = "VALIDATION_001",
  NOT_FOUND = "NOT_FOUND_001",
  CONFLICT_ERROR = "CONFLICT_ERROR_001",
  PARTY_ADD_FAILED = "PARTY_ADD_FAILED",
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
