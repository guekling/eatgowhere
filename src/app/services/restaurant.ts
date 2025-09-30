import db from "../database/models";
import {
  Restaurant,
  RestaurantAttributes,
} from "../database/models/restaurant";
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

export async function getRestaurantsBySessionId(sessionId: string) {
  const restaurants = await db.Restaurant.findAll({
    where: { session_id: sessionId },
  });

  return restaurants;
}

export async function updateRestaurant(
  restaurantId: string,
  updates: Partial<RestaurantAttributes>
): Promise<Restaurant> {
  const [affectedRow, [updatedRestaurant]] = await db.Restaurant.update(
    { ...updates },
    { where: { id: restaurantId }, returning: true }
  );

  if (affectedRow !== 1) {
    throw new Error(ErrorType.BAD_REQUEST);
  }

  return updatedRestaurant;
}
