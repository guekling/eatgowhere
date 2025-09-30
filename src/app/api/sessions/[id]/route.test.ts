import { StatusCodes } from "http-status-codes/build/cjs/status-codes";
import { NextRequest } from "next/server";
import { POST as POST_SESSION } from "./../route";
import { POST as POST_USER } from "./users/route";
import { HEAD } from "./route";
import { NewSessionResponse } from "@/app/lib/interfaces";
import { UserRoles } from "@/app/lib/types";
import { randomUUID } from "crypto";

describe("HEAD /api/sessions/:id", () => {
  it("should return 204 for existing session", async () => {
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

    // check existence of the created session
    const headRequest = new NextRequest(
      `http://localhost/api/sessions/${sessionId}`,
      {
        method: "HEAD",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const headResponse = await HEAD(headRequest, { params: { id: sessionId } });

    expect(headResponse.status).toBe(StatusCodes.NO_CONTENT);
  });

  it("should return 400 for a session without an initiator", async () => {
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

    // check existence of the created session
    const headRequest = new NextRequest(
      `http://localhost/api/sessions/${sessionId}`,
      {
        method: "HEAD",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const headResponse = await HEAD(headRequest, { params: { id: sessionId } });

    expect(headResponse.status).toBe(StatusCodes.BAD_REQUEST);
  });

  it("should return 404 for non-existing session", async () => {
    const nonExistingSessionId = randomUUID();

    const headRequest = new NextRequest(
      `http://localhost/api/sessions/${nonExistingSessionId}`,
      {
        method: "HEAD",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const headResponse = await HEAD(headRequest, {
      params: { id: nonExistingSessionId },
    });

    expect(headResponse.status).toBe(StatusCodes.BAD_REQUEST);
  });
});
