import { SessionIdPathParams } from "@/app/lib/interfaces";
import { ErrorDetails, ErrorType, UserRoles } from "@/app/lib/types";
import {
  createUserBodySchema,
  sessionIdPathParamsSchema,
} from "@/app/lib/validators";
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
    const { username } = bodyResult.data;
    // -- end validations --

    const user = await createUser(sessionId, username, UserRoles.INITIATOR);

    return NextResponse.json(user, { status: StatusCodes.CREATED });
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
