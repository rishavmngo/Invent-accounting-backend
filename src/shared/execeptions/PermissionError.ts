import { AppError } from "../appError.error";
import { ErrorCode } from "../errorCode";

export class PermissionError extends AppError {
  constructor(message = "Not allowed to access this resource") {
    super(message, 403, ErrorCode.UNEXPECTED_ERROR);
  }
}
