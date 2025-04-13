import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { AppError } from "./appError.error";
import logger from "./logger";

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof AppError) {
    if (err.isOperational) {
      res.status(err.statusCode).json({
        success: false,
        code: err.code,
        message: err.message,
      });
      return;
    }
  }

  logger.error("Unhandled error:", err);

  res.status(500).json({
    success: false,
    code: "SERVER_ERROR",
    message: "Something went wrong!",
  });
};
