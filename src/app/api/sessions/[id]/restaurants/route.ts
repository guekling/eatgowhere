import { SessionIdPathParams } from "@/app/lib/interfaces";
import { ErrorDetails, ErrorType } from "@/app/lib/types";
import {
  createRestaurantBodySchema,
  sessionIdPathParamsSchema,
} from "@/app/lib/validators";
import { isUserAuthenticated } from "@/app/services/auth";
import { createRestaurant } from "@/app/services/restaurant";
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
    const bodyResult = createRestaurantBodySchema.safeParse(body);

    if (!pathResult.success || !bodyResult.success) {
      const { message, status } = ErrorDetails[ErrorType.VALIDATION_ERROR];
      return NextResponse.json({ error: message }, { status });
    }

    const sessionId = pathResult.data.id;
    const { name } = bodyResult.data;
    // -- end validations --

    // -- auth --
    const user = await isUserAuthenticated(sessionId);
    // -- end auth --

    const restaurant = await createRestaurant({
      name,
      userId: user.getDataValue("id"),
      sessionId,
    });

    return NextResponse.json(restaurant, { status: StatusCodes.CREATED });
  } catch (error) {
    console.error("Error creating restaurant:", error);

    if (error instanceof Error && error.message === ErrorType.UNAUTHORIZED) {
      const { message, status } = ErrorDetails[ErrorType.UNAUTHORIZED];
      return NextResponse.json({ error: message }, { status });
    }

    if (
      error instanceof Error &&
      error.message === ErrorType.RESTAURANT_EXISTS
    ) {
      const { message, status } = ErrorDetails[ErrorType.RESTAURANT_EXISTS];
      return NextResponse.json({ error: message }, { status });
    }

    const { message, status } = ErrorDetails[ErrorType.INTERNAL_SERVER_ERROR];
    return NextResponse.json({ error: message }, { status });
  }
}
