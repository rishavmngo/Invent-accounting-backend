import { AppError } from "../appError.error";
import { ErrorCode } from "../errorCode";

export class NotFoundError extends AppError {
  constructor(resource = "Resource", id?: string | number) {
    super(
      `${resource}${id ? ` with ID ${id}` : ""} not found`,
      404,
      ErrorCode.NOT_FOUND,
    );
  }
}
