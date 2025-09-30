import { Op } from "sequelize";
import db from "../database/models";
import { Session } from "../database/models/session";
import { ErrorType, SessionStatus, UserRoles } from "../lib/types";
import { RestaurantAttributes } from "../database/models/restaurant";
import {
  SessionAssociations,
  SessionInfo,
  UserRestaurantAttributes,
} from "../lib/interfaces";
import { UserAttributes } from "../database/models/user";

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

export async function getValidSession(sessionId: string): Promise<Session> {
  const session = await db.Session.findOne({
    where: {
      id: sessionId,
      status: {
        [Op.ne]: SessionStatus.ENDED,
      },
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

      acc[user.id] = newUserObject;
      return acc;
    },
    {}
  );

  return {
    ...sessionData,
    users: reduceUsers,
    restaurants: undefined,
  };
}
