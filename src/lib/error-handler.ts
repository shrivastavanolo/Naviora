import { ZodError, z } from "zod";
import { AppError } from "./errors";

export function getErrorResponse(error: unknown) {
  if (error instanceof ZodError) {
    return {
      status: 400,
      body: {
        message: "Validation failed",
        errors: z.treeifyError(error),
      },
    };
  }

  if (error instanceof AppError) {
    return {
      status: error.statusCode,
      body: {
        message: error.message,
      },
    };
  }

  console.error(error);

  return {
    status: 500,
    body: {
      message: "Internal Server Error",
    },
  };
}
