import { ErrorDetails, ErrorType } from "@/app/lib/types";
import { createSession } from "@/app/services/session";
import { StatusCodes } from "http-status-codes";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const session = await createSession();

    return NextResponse.json(session, { status: StatusCodes.CREATED });
  } catch (error) {
    console.error("Error creating session:", error);

    const { message, status } = ErrorDetails[ErrorType.INTERNAL_SERVER_ERROR];
    return NextResponse.json({ error: message }, { status });
  }
}
