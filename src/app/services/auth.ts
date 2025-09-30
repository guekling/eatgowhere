import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { AccessTokenPayload, ErrorType } from "../lib/types";
import { getUser } from "./user";
import { User } from "../database/models/user";

const secretKey: jwt.Secret = process.env.JWT_SECRET || "your_jwt_secret_key";
const expiry: jwt.SignOptions["expiresIn"] =
  (process.env.ACCESS_TOKEN_EXPIRY as jwt.SignOptions["expiresIn"]) || "7d";

export function generateAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, secretKey, { expiresIn: expiry });
}

export function decodeAccessToken(token: string): AccessTokenPayload | null {
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded as AccessTokenPayload;
  } catch (error) {
    return null;
  }
}

export async function isUserAuthenticated(
  requestSessionId?: string
): Promise<User> {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken");
  if (!token) {
    throw new Error(ErrorType.UNAUTHORIZED);
  }

  const userData = decodeAccessToken(token.value);
  if (!userData) {
    throw new Error(ErrorType.UNAUTHORIZED);
  }

  const user = await getUser(userData.userId, userData.sessionId);
  if (
    !user ||
    (requestSessionId && user.getDataValue("session_id") !== requestSessionId)
  ) {
    throw new Error(ErrorType.UNAUTHORIZED);
  }

  return user;
}
