import { Op } from "sequelize";
import db from "../database/models";
import { Session, SessionAttributes } from "../database/models/session";
import { ErrorType, SessionStatus } from "../lib/types";
import { RestaurantAttributes } from "../database/models/restaurant";
import {
  SessionAssociations,
  SessionInfo,
  UserRestaurantAttributes,
} from "../lib/interfaces";
import { UserAttributes } from "../database/models/user";
import { getRestaurantsBySessionId, updateRestaurant } from "./restaurant";

export async function createSession(): Promise<Session> {
  const session = await db.Session.create();

  return session;
}

export async function getSessionById(
  sessionId: string
): Promise<Session | null> {
  const session = await db.Session.findByPk(sessionId);

  return session;
}

export async function getValidSession(
  sessionId: string,
  includeEnded = false
): Promise<Session> {
  const session = await db.Session.findOne({
    where: {
      id: sessionId,
      ...(includeEnded ? {} : { status: { [Op.ne]: SessionStatus.ENDED } }),
      created_by: {
        [Op.not]: null as any,
      },
    },
  });

  if (!session) {
    throw new Error(ErrorType.INVALID_SESSION);
  }

  return session;
}

export async function getSessionInfo(sessionId: string): Promise<SessionInfo> {
  const session = await db.Session.findByPk(sessionId, {
    include: [
      { model: db.User, as: "users" },
      { model: db.Restaurant, as: "restaurants" },
    ],
  });

  if (!session) {
    throw new Error(ErrorType.INVALID_SESSION);
  }

  const sessionData: SessionAssociations = session.toJSON();

  let chosenRestaurant: string | undefined = undefined;
  const sessionRestaurants = sessionData.restaurants;
  const reduceUsers = sessionData.users.reduce(
    (acc: Record<string, UserRestaurantAttributes>, user: UserAttributes) => {
      const restaurant = sessionRestaurants.find(
        (restaurant: RestaurantAttributes) =>
          restaurant.submitted_by === user.id
      );

      const newUserObject: UserRestaurantAttributes = {
        ...user,
        restaurant: restaurant ? restaurant.name : undefined,
      };

      if (restaurant && restaurant.chosen) {
        chosenRestaurant = restaurant.name;
      }

      acc[user.id] = newUserObject;
      return acc;
    },
    {}
  );

  return {
    ...sessionData,
    chosen_restaurant: chosenRestaurant,
    users: reduceUsers,
    restaurants: undefined,
  };
}

export async function updateSession(
  sessionId: string,
  updates: Partial<SessionAttributes>
): Promise<Session> {
  const [affectedRow, [updatedSession]] = await db.Session.update(
    { ...updates },
    { where: { id: sessionId }, returning: true }
  );

  if (affectedRow !== 1) {
    throw new Error(ErrorType.BAD_REQUEST);
  }

  if (updates.status === SessionStatus.ENDED) {
    await endSession(sessionId);
  }

  return updatedSession;
}

export async function endSession(sessionId: string): Promise<void> {
  const restaurants = await getRestaurantsBySessionId(sessionId);

  if (restaurants.length > 0) {
    const randomIndex = Math.floor(Math.random() * restaurants.length);
    const chosenRestaurant = restaurants[randomIndex];
    await updateRestaurant(chosenRestaurant.getDataValue("id"), {
      chosen: true,
    });
  }
}
