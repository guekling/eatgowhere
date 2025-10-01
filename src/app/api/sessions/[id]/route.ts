import { SessionIdPathParams } from "@/app/lib/interfaces";
import { ErrorDetails, ErrorType } from "@/app/lib/types";
import {
  sessionIdPathParamsSchema,
  updateSessionBodySchema,
} from "@/app/lib/validators";
import { isUserAuthenticated, isUserInitiator } from "@/app/services/auth";
import {
  getSessionInfo,
  getValidSession,
  updateSession,
} from "@/app/services/session";
import { StatusCodes } from "http-status-codes";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: SessionIdPathParams }
) {
  try {
    // -- validations --
    const pathResult = sessionIdPathParamsSchema.safeParse(await params);
    if (!pathResult.success) {
      const { message, status } = ErrorDetails[ErrorType.VALIDATION_ERROR];
      return NextResponse.json({ error: message }, { status });
    }

    const sessionId = pathResult.data.id;
    // -- end validations --

    // -- auth --
    await isUserAuthenticated(sessionId);
    // -- end auth --

    const session = await getSessionInfo(sessionId);

    return NextResponse.json(session, { status: StatusCodes.OK });
  } catch (error) {
    console.error("Error getting session info:", error);

    if (error instanceof Error && error.message === ErrorType.INVALID_SESSION) {
      const { message, status } = ErrorDetails[ErrorType.INVALID_SESSION];
      return NextResponse.json({ error: message }, { status });
    }

    const { message, status } = ErrorDetails[ErrorType.INTERNAL_SERVER_ERROR];
    return NextResponse.json({ error: message }, { status });
  }
}

export async function HEAD(
  request: NextRequest,
  { params }: { params: SessionIdPathParams }
) {
  try {
    // -- validations --
    const pathResult = sessionIdPathParamsSchema.safeParse(await params);
    if (!pathResult.success) {
      const { message, status } = ErrorDetails[ErrorType.VALIDATION_ERROR];
      return NextResponse.json({ error: message }, { status });
    }

    const sessionId = pathResult.data.id;
    // -- end validations --

    await getValidSession(sessionId);

    return new NextResponse(null, { status: StatusCodes.NO_CONTENT });
  } catch (error) {
    console.error("Error checking session existence:", error);

    if (error instanceof Error && error.message === ErrorType.INVALID_SESSION) {
      const { message, status } = ErrorDetails[ErrorType.INVALID_SESSION];
      return NextResponse.json({ error: message }, { status });
    }

    const { message, status } = ErrorDetails[ErrorType.INTERNAL_SERVER_ERROR];
    return NextResponse.json({ error: message }, { status });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: SessionIdPathParams }
) {
  try {
    // -- validations --
    const pathResult = sessionIdPathParamsSchema.safeParse(await params);

    const body = await request.json();
    const bodyResult = updateSessionBodySchema.safeParse(body);

    if (!pathResult.success || !bodyResult.success) {
      const { message, status } = ErrorDetails[ErrorType.VALIDATION_ERROR];
      return NextResponse.json({ error: message }, { status });
    }

    const sessionId = pathResult.data.id;
    const { status, ended_at } = bodyResult.data;
    // -- end validations --

    // -- auth --
    const user = await isUserAuthenticated(sessionId);
    await isUserInitiator(user.getDataValue("id"), sessionId);
    // -- end auth --

    const updatedSession = await updateSession(sessionId, {
      status,
      ended_at: new Date(ended_at),
    });

    return NextResponse.json(updatedSession, { status: StatusCodes.OK });
  } catch (error) {
    console.error("Error updating session:", error);

    const { message, status } = ErrorDetails[ErrorType.INTERNAL_SERVER_ERROR];
    return NextResponse.json({ error: message }, { status });
  }
}
