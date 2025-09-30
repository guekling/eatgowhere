import { StatusCodes } from "http-status-codes";

export enum SessionStatus {
  ACTIVE = "active",
  ENDED = "ended",
}

export enum UserRoles {
  INITIATOR = "initiator",
  PARTICIPANT = "participant",
}

export type AccessTokenPayload = {
  userId: string;
  sessionId: string;
};

// ================================== //
// Error Handling Types and Details  //
// ================================== //

export enum ErrorMessages {
  CREATE_SESSION_ERROR = "Error creating session. Please try again later.",
  CREATE_USER_ERROR = "Error creating user. Please try again later.",
}

export enum ErrorType {
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  INVALID_SESSION = "INVALID_SESSION",
  INITIATOR_EXISTS = "INITIATOR_EXISTS",
  UNAUTHORIZED = "UNAUTHORIZED",
  RESTAURANT_EXISTS = "RESTAURANT_EXISTS",
  FORBIDDEN = "FORBIDDEN",
  BAD_REQUEST = "BAD_REQUEST",
}

export const ErrorDetails: Record<
  ErrorType,
  { message: string; status: number }
> = {
  [ErrorType.INTERNAL_SERVER_ERROR]: {
    message: "Internal server error",
    status: StatusCodes.INTERNAL_SERVER_ERROR,
  },
  [ErrorType.VALIDATION_ERROR]: {
    message: "Validation error",
    status: StatusCodes.UNPROCESSABLE_ENTITY,
  },
  [ErrorType.INVALID_SESSION]: {
    message: "Invalid session",
    status: StatusCodes.BAD_REQUEST,
  },
  [ErrorType.INITIATOR_EXISTS]: {
    message: "Initiator already exists",
    status: StatusCodes.CONFLICT,
  },
  [ErrorType.UNAUTHORIZED]: {
    message: "Unauthorized",
    status: StatusCodes.UNAUTHORIZED,
  },
  [ErrorType.RESTAURANT_EXISTS]: {
    message: "Restaurant already exists",
    status: StatusCodes.CONFLICT,
  },
  [ErrorType.FORBIDDEN]: {
    message: "Forbidden",
    status: StatusCodes.FORBIDDEN,
  },
  [ErrorType.BAD_REQUEST]: {
    message: "Bad request",
    status: StatusCodes.BAD_REQUEST,
  },
};
