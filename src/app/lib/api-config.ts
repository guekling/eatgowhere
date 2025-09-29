import { HttpMethod } from "../utils/api";

export const API_CONFIG = {
  createSession: {
    url: "/api/sessions",
    method: HttpMethod.POST,
  },
  createUser: {
    url: "/api/sessions/:sessionId/users",
    method: HttpMethod.POST,
  },
};
