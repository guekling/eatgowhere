import { Op } from "sequelize";
import db from "../database/models";
import { Session } from "../database/models/session";
import { ErrorType, SessionStatus, UserRoles } from "../lib/types";

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

export async function getSessionInfo(sessionId: string): Promise<Session> {
  const session = await db.Session.findByPk(sessionId, {
    include: [{ model: db.User, as: "users" }],
  });

  if (!session) {
    throw new Error(ErrorType.INVALID_SESSION);
  }

  return session;
}
