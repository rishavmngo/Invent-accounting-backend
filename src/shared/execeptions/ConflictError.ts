import { AppError } from "../appError.error";
import { ErrorCode } from "../errorCode";

export class ConflictError extends AppError {
  constructor(message = "Resource already exists") {
    super(message, 409, ErrorCode.CONFLICT_ERROR);
  }
}
