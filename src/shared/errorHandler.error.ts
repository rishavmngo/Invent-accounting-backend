// import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
// import { CustomError } from "./customError.error";
//
// export const errorHandler: ErrorRequestHandler = (
//   error: Error,
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   if (error instanceof CustomError) {
//     res.status(error.statusCode).json(error.serialize());
//     return;
//   }
//
//   res.status(500).json({
//     message: "Something went wrong",
//     error: error.message,
//   });
// };
