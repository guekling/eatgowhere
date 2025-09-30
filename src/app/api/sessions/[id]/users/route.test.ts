import { POST as POST_SESSION } from "./../../route";
import { POST as POST_USER } from "./route";
import { StatusCodes } from "http-status-codes";
import { NextRequest } from "next/server";
import { randomUUID } from "crypto";
import { NewSessionResponse, NewUserResponse } from "@/app/lib/interfaces";
import { ErrorDetails, ErrorType, UserRoles } from "@/app/lib/types";

describe("POST /api/sessions/:id/users", () => {
  let existingInitiatorSessionId: string;

  it("should add a user to an existing session", async () => {
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
    existingInitiatorSessionId = sessionId;

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
    const userData: NewUserResponse = await addUserResponse.json();

    expect(addUserResponse.status).toBe(StatusCodes.CREATED);
    expect(userData).toHaveProperty("id");
    expect(userData).toHaveProperty("session_id", sessionId);
    expect(userData).toHaveProperty("username");
    expect(userData).toHaveProperty("role", UserRoles.INITIATOR);
  });

  it("should return 400 for invalid session ID", async () => {
    const invalidSessionId = randomUUID();

    const addUserRequest = new NextRequest(
      `http://localhost/api/sessions/${invalidSessionId}/users`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "testuser",
          role: UserRoles.INITIATOR,
        }),
      }
    );

    const addUserResponse = await POST_USER(addUserRequest, {
      params: { id: invalidSessionId },
    });
    const userData = await addUserResponse.json();

    expect(addUserResponse.status).toBe(
      ErrorDetails[ErrorType.INVALID_SESSION].status
    );
    expect(userData.error).toBe(
      ErrorDetails[ErrorType.INVALID_SESSION].message
    );
  });

  it("should return 422 for invalid request body", async () => {
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

    const invalidBodies = [
      { username: "validuser", role: "INVALID_ROLE" },
      { role: UserRoles.PARTICIPANT },
      { username: "userwithoutrole" },
      { username: "test123user@!#;", role: UserRoles.PARTICIPANT }, // invalid username type
    ];

    for (const invalidBody of invalidBodies) {
      // add a user to the created session
      const addUserRequest = new NextRequest(
        `http://localhost/api/sessions/${sessionId}/users`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(invalidBody),
        }
      );

      const addUserResponse = await POST_USER(addUserRequest, {
        params: { id: sessionId },
      });
      const userData = await addUserResponse.json();

      expect(addUserResponse.status).toBe(
        ErrorDetails[ErrorType.VALIDATION_ERROR].status
      );
      expect(userData.error).toBe(
        ErrorDetails[ErrorType.VALIDATION_ERROR].message
      );
    }
  });

  it("should return 409 for existing initiator", async () => {
    const addUserRequest = new NextRequest(
      `http://localhost/api/sessions/${existingInitiatorSessionId}/users`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "testuser",
          role: UserRoles.INITIATOR,
        }),
      }
    );

    const addUserResponse = await POST_USER(addUserRequest, {
      params: { id: existingInitiatorSessionId },
    });
    const userData = await addUserResponse.json();

    expect(addUserResponse.status).toBe(
      ErrorDetails[ErrorType.INITIATOR_EXISTS].status
    );
    expect(userData.error).toBe(
      ErrorDetails[ErrorType.INITIATOR_EXISTS].message
    );
  });
});
