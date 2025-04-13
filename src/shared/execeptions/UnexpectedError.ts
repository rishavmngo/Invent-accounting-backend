import { AppError } from "../appError.error";
import { ErrorCode } from "../errorCode";

export class UnexpectedError extends AppError {
  constructor(message = "Something went wrong") {
    super(message, 500, ErrorCode.UNEXPECTED_ERROR);
  }
}
