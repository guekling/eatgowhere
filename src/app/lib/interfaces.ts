import { RestaurantAttributes } from "../database/models/restaurant";
import { SessionAttributes } from "../database/models/session";
import { UserAttributes } from "../database/models/user";
import { SessionStatus, UserRoles } from "./types";

export interface SessionIdPathParams {
  id: string;
}

export interface NewSessionResponse extends SessionAttributes {
  id: string;
  status: SessionStatus;
  created_at: Date;
  updated_at: Date;
  created_by?: string;
  updated_by?: string;
}

export interface NewUserResponse extends UserAttributes {
  id: string;
  username: string;
  session_id: string;
  role: UserRoles;
  created_at: Date;
  updated_at: Date;
}

export interface GetSessionInfoResponse extends SessionInfo {}

export interface UpdateSessionResponse extends SessionAttributes {}

export interface AddRestaurantResponse extends RestaurantAttributes {}

export interface AuthResponse extends NewUserResponse {}

// --------------------------------------------- //
// Extended interfaces for service return types //
// -------------------------------------------- //

export interface SessionInfo extends NewSessionResponse {
  chosen_restaurant?: string;
  users: Record<string, UserRestaurantAttributes>;
  restaurants?: RestaurantAttributes[];
}

export interface SessionAssociations extends SessionAttributes {
  users: UserAttributes[];
  restaurants: RestaurantAttributes[];
}

export interface UserRestaurantAttributes extends UserAttributes {
  restaurant?: string;
}
