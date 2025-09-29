import { SessionStatus } from "@/app/lib/types";
import { StatusCodes } from "http-status-codes";
import { NextRequest } from "next/server";
import { POST as POST_SESSION } from "./route";
import { NewSessionResponse } from "@/app/lib/interfaces";

describe("POST /api/sessions", () => {
  it("should create a new session", async () => {
    const request = new NextRequest("http://localhost/api/sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST_SESSION(request);
    const data: NewSessionResponse = await response.json();

    expect(response.status).toBe(StatusCodes.CREATED);
    expect(data).toHaveProperty("id");
    expect(data).toHaveProperty("status", SessionStatus.ACTIVE);
  });
});
