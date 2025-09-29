import { SessionStatus } from "./types";

export interface NewSessionResponse {
  id: string;
  status: SessionStatus;
  created_at: Date;
  updated_at: Date;
  created_by?: string;
  updated_by?: string;
}
