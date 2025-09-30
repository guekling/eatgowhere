import { ErrorDetails, ErrorType } from "@/app/lib/types";
import { isUserAuthenticated } from "@/app/services/auth";
import { StatusCodes } from "http-status-codes";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const user = await isUserAuthenticated();

    return NextResponse.json(user, { status: StatusCodes.OK });
  } catch (error) {
    console.error("Error authenticating:", error);

    if (error instanceof Error && error.message === ErrorType.UNAUTHORIZED) {
      const { message, status } = ErrorDetails[ErrorType.UNAUTHORIZED];
      return NextResponse.json({ error: message }, { status });
    }

    const { message, status } = ErrorDetails[ErrorType.INTERNAL_SERVER_ERROR];
    return NextResponse.json({ error: message }, { status });
  }
}
