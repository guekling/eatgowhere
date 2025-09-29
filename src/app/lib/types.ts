import { StatusCodes } from "http-status-codes";

export enum SessionStatus {
  ACTIVE = 'active',
  ENDED = 'ended',
}

export enum UserRoles {
  INITIATOR = 'initiator',
  PARTICIPANT = 'participant',
}

// ================================== //
// Error Handling Types and Details  //
// ================================== //

export enum ErrorMessages {
  CREATE_SESSION_ERROR = 'Error creating session. Please try again later.',
}

export enum ErrorType {
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
}

export const ErrorDetails: Record<ErrorType, { message: string; status: number }> = {
  [ErrorType.INTERNAL_SERVER_ERROR]: { message: 'Internal server error', status: StatusCodes.INTERNAL_SERVER_ERROR },
};