import { get } from "http";
import db from "../database/models";
import { User } from "../database/models/user";
import { ErrorType, SessionStatus, UserRoles } from "../lib/types";
import { getSessionById } from "./session";

export async function createUser(
  sessionId: string,
  username: string,
  role: UserRoles
): Promise<User> {
  // @todo: refactor to use getValidSession
  const session = await getSessionById(sessionId);
  if (!session || session.getDataValue("status") !== SessionStatus.ACTIVE) {
    throw new Error(ErrorType.INVALID_SESSION);
  }

  if (
    role === UserRoles.INITIATOR &&
    session.getDataValue("created_by") !== null
  ) {
    throw new Error(ErrorType.INITIATOR_EXISTS);
  }

  const user = await db.User.create({
    session_id: sessionId,
    username,
    role,
  });

  if (role === UserRoles.INITIATOR) {
    await db.Session.update(
      { created_by: user.getDataValue("id") },
      { where: { id: sessionId } }
    );
  }

  return user;
}
