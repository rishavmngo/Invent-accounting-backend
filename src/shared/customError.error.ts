import { ZodError } from "zod";

export abstract class CustomError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
  abstract statusCode: number;
  abstract serialize(): { message: string };
}

export class DatabaseError extends CustomError {
  constructor() {
    super("Database Error. Try again later...");
  }
  statusCode = 500;
  serialize() {
    return { message: "Database Error. Try again later." };
  }
}

export class ValidationError extends CustomError {
  constructor(error: Error) {
    super("Validation Error: ");
    if (error instanceof ZodError) {
      error.issues.forEach((issue) => {
        this.message += issue.message + "\n";
      });
    }
  }
  statusCode = 400;

  serialize() {
    return { message: this.message };
  }
}

export class ConflictError extends CustomError {
  constructor(message: string) {
    super(message);
  }
  statusCode = 409;

  serialize() {
    return { message: this.message };
  }
}
