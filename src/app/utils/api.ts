import { StatusCodes } from "http-status-codes";

export enum HttpStatus {
  OK = StatusCodes.OK,
  CREATED = StatusCodes.CREATED,
}

export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PATCH = "PATCH",
}

export const sendRequest = async <T>(
  path: string,
  method: HttpMethod,
  acceptedResponseCodes: HttpStatus[],
  body?: unknown
): Promise<T> => {
  const response = await fetch(path, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const responseData = await response.json();

  if (acceptedResponseCodes.indexOf(response.status) === -1) {
    throw new Error(responseData.message || "Unexpected response");
  }

  return responseData;
};
