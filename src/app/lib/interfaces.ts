import { SessionStatus, UserRoles } from "./types";

export interface SessionIdPathParams {
  id: string;
}

export interface NewSessionResponse {
  id: string;
  status: SessionStatus;
  created_at: Date;
  updated_at: Date;
  created_by?: string;
  updated_by?: string;
}

export interface NewUserResponse {
  id: string;
  username: string;
  session_id: string;
  role: UserRoles;
  created_at: Date;
  updated_at: Date;
}
