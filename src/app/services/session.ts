import db from "../database/models";
import { Session } from "../database/models/session";

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
