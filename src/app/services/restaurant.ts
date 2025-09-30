import db from "../database/models";
import { ErrorType } from "../lib/types";

export async function createRestaurant({
  name,
  userId,
  sessionId,
}: {
  name: string;
  userId: string;
  sessionId: string;
}) {
  const existingRestaurant = await db.Restaurant.findOne({
    where: { name, session_id: sessionId },
  });

  if (existingRestaurant) {
    throw new Error(ErrorType.RESTAURANT_EXISTS);
  }

  const restaurant = await db.Restaurant.create({
    name,
    submitted_by: userId,
    session_id: sessionId,
  });

  return restaurant;
}
