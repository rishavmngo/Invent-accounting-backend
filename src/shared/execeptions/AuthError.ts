import { AppError } from "../appError.error";
import { ErrorCode } from "../errorCode";

export class AuthError extends AppError {
  constructor(message = "Authentication required") {
    super(message, 401, ErrorCode.INVALID_CREDENTIALS);
  }
}
