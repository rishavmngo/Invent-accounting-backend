import { AppError } from "../appError.error";
import { ErrorCode } from "../errorCode";

export class DatabaseError extends AppError {
  constructor(message = "Database operation failed") {
    super(message, 500, ErrorCode.UNEXPECTED_ERROR);
  }
}
