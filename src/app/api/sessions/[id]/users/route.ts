import { SessionIdPathParams } from "@/app/lib/interfaces";
import { ErrorDetails, ErrorType, UserRoles } from "@/app/lib/types";
import {
  createUserBodySchema,
  sessionIdPathParamsSchema,
} from "@/app/lib/validators";
import { generateAccessToken } from "@/app/services/auth";
import { createUser } from "@/app/services/user";
import { StatusCodes } from "http-status-codes";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: SessionIdPathParams }
) {
  try {
    // -- validations --
    const pathResult = sessionIdPathParamsSchema.safeParse(await params);

    const body = await request.json();
    const bodyResult = createUserBodySchema.safeParse(body);

    if (!pathResult.success || !bodyResult.success) {
      const { message, status } = ErrorDetails[ErrorType.VALIDATION_ERROR];
      return NextResponse.json({ error: message }, { status });
    }

    const sessionId = pathResult.data.id;
    const { username, role } = bodyResult.data;
    // -- end validations --

    const user = await createUser(sessionId, username, role);
    const token = generateAccessToken({
      userId: user.getDataValue("id"),
      sessionId,
    });

    const response = NextResponse.json(user, { status: StatusCodes.CREATED });
    response.cookies.set("accessToken", token, {
      httpOnly: true, // inaccessible to JavaScript in the browser
      secure: process.env.NODE_ENV === "production", // send over HTTPS
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days - @todo: read from config
      path: "/", // available to all routes on domain
    });
    return response;
  } catch (error) {
    console.error("Error creating user:", error);

    if (error instanceof Error && error.message === ErrorType.INVALID_SESSION) {
      const { message, status } = ErrorDetails[ErrorType.INVALID_SESSION];
      return NextResponse.json({ error: message }, { status });
    }

    if (
      error instanceof Error &&
      error.message === ErrorType.INITIATOR_EXISTS
    ) {
      const { message, status } = ErrorDetails[ErrorType.INITIATOR_EXISTS];
      return NextResponse.json({ error: message }, { status });
    }

    const { message, status } = ErrorDetails[ErrorType.INTERNAL_SERVER_ERROR];
    return NextResponse.json({ error: message }, { status });
  }
}
