import { AppError } from "../appError.error";
import { ErrorCode } from "../errorCode";
export class ValidationError extends AppError {
  constructor(message = "Validation error") {
    super(message, 400, ErrorCode.VALIDATION_ERROR);
  }
}
