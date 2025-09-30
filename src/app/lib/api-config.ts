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
  getSession: {
    url: "/api/sessions/:sessionId",
    method: HttpMethod.GET,
  },
  validateSession: {
    url: "/api/sessions/:sessionId",
    method: HttpMethod.HEAD,
  },
  updateSession: {
    url: "/api/sessions/:sessionId",
    method: HttpMethod.PATCH,
  },
  createRestaurant: {
    url: "/api/sessions/:sessionId/restaurants",
    method: HttpMethod.POST,
  },
  auth: {
    url: "/api/auth",
    method: HttpMethod.GET,
  },
};
