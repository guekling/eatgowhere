import { RestaurantAttributes } from "@/app/database/models/restaurant";
import { NewSessionResponse, NewUserResponse } from "@/app/lib/interfaces";
import { ErrorDetails, ErrorType, UserRoles } from "@/app/lib/types";
import { StatusCodes } from "http-status-codes";
import { after, NextRequest } from "next/server";
import { POST as POST_SESSION } from "../../route";
import { POST as POST_USER } from "./../users/route";
import { POST as POST_RESTAURANT } from "./route";
import { cookies } from "next/headers";
import { randomUUID } from "crypto";

// mock Next.JS cookies API
jest.mock("next/headers", () => ({
  cookies: jest.fn(() => ({
    get: jest.fn(),
  })),
}));

describe("POST /api/sessions/:id/restaurants", () => {
  let reusableSessionId: string;
  const mockCookies = cookies as jest.Mock;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should add a restaurant to an existing session", async () => {
    // create a new session
    const createSessionRequest = new NextRequest(
      "http://localhost/api/sessions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const createSessionResponse = await POST_SESSION(createSessionRequest);
    const sessionData: NewSessionResponse = await createSessionResponse.json();
    const sessionId = sessionData.id;
    reusableSessionId = sessionId;

    // add a user to the created session
    const addUserRequest = new NextRequest(
      `http://localhost/api/sessions/${sessionId}/users`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "testuser123",
          role: UserRoles.INITIATOR,
        }),
      }
    );

    const addUserResponse = await POST_USER(addUserRequest, {
      params: { id: sessionId },
    });
    expect(addUserResponse.status).toBe(StatusCodes.CREATED);

    const cookie = addUserResponse.headers.get("Set-Cookie");
    const match = cookie?.match(/accessToken=([^;]*)/);
    const accessToken = match ? match[1] : null;
    expect(accessToken).not.toBeNull();

    mockCookies.mockImplementation(() => ({
      get: jest.fn(() => ({ value: accessToken })),
    }));

    // add a restaurant to the created session
    const addRestaurantRequest = new NextRequest(
      `http://localhost/api/sessions/${sessionId}/restaurants`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Test Restaurant",
        }),
      }
    );

    const addRestaurantResponse = await POST_RESTAURANT(addRestaurantRequest, {
      params: { id: sessionId },
    });
    const restaurantData: RestaurantAttributes =
      await addRestaurantResponse.json();

    expect(addRestaurantResponse.status).toBe(StatusCodes.CREATED);
    expect(restaurantData).toHaveProperty("id");
    expect(restaurantData).toHaveProperty("name", "Test Restaurant");
    expect(restaurantData).toHaveProperty("session_id", sessionId);
  });

  it("should return 422 for invalid session ID", async () => {
    const invalidSessionId = randomUUID();

    // add a user to the created session
    const addUserRequest = new NextRequest(
      `http://localhost/api/sessions/${reusableSessionId}/users`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "testuser123",
          role: UserRoles.PARTICIPANT,
        }),
      }
    );

    const addUserResponse = await POST_USER(addUserRequest, {
      params: { id: reusableSessionId },
    });
    expect(addUserResponse.status).toBe(StatusCodes.CREATED);

    const cookie = addUserResponse.headers.get("Set-Cookie");
    const match = cookie?.match(/accessToken=([^;]*)/);
    const accessToken = match ? match[1] : null;
    expect(accessToken).not.toBeNull();

    mockCookies.mockImplementation(() => ({
      get: jest.fn(() => ({ value: accessToken })),
    }));

    // add a restaurant to the created session
    const addRestaurantRequest = new NextRequest(
      `http://localhost/api/sessions/${invalidSessionId}/restaurants`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Test Restaurant",
        }),
      }
    );

    const addRestaurantResponse = await POST_RESTAURANT(addRestaurantRequest, {
      params: { id: invalidSessionId },
    });
    const addRestaurantData = await addRestaurantResponse.json();
    expect(addRestaurantResponse.status).toBe(
      ErrorDetails[ErrorType.UNAUTHORIZED].status
    );
    expect(addRestaurantData.error).toBe(
      ErrorDetails[ErrorType.UNAUTHORIZED].message
    );
  });
});
