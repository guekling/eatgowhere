import { StatusCodes } from "http-status-codes";

export enum HttpStatus {
  OK = StatusCodes.OK,
  CREATED = StatusCodes.CREATED,
  NO_CONTENT = StatusCodes.NO_CONTENT,
}

export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PATCH = "PATCH",
  HEAD = "HEAD",
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

  let responseData;

  switch (method) {
    case HttpMethod.GET:
    case HttpMethod.POST:
    case HttpMethod.PATCH:
      responseData = await response.json();
      break;
    case HttpMethod.HEAD:
      responseData = { message: "No Content" };
      break;
    default:
      throw new Error("Unsupported HTTP method");
  }

  console.log("responseStatus", response.status);

  if (acceptedResponseCodes.indexOf(response.status) === -1) {
    throw new Error(responseData.message || "Unexpected response");
  }

  return responseData;
};
