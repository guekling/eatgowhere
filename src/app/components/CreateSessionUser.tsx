"use client";

import { useState } from "react";
import { API_CONFIG } from "../lib/api-config";
import { HttpStatus, sendRequest } from "../utils/api";
import { ErrorMessages, UserRoles } from "../lib/types";
import { NewUserResponse } from "../lib/interfaces";
import LoadingPage from "./LoadingPage";

interface CreateSessionInitiatorProps {
  sessionId: string;
  role: UserRoles;
  onUserCreated?: (username: string) => void;
}

export default function CreateSessionInitiator({
  sessionId,
  onUserCreated,
  role,
}: CreateSessionInitiatorProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [username, setUsername] = useState<string>("");

  async function handleCreateUser(sessionId: string) {
    setLoading(true);
    try {
      const response: NewUserResponse = await sendRequest(
        API_CONFIG.createUser.url.replace(":sessionId", sessionId),
        API_CONFIG.createUser.method,
        [HttpStatus.CREATED],
        { username: username, role: role }
      );

      if (!response) {
        setError(ErrorMessages.CREATE_USER_ERROR);
        return;
      }

      if (onUserCreated && role === UserRoles.INITIATOR) {
        onUserCreated(response.username);
      }
    } catch (error) {
      setError(ErrorMessages.CREATE_USER_ERROR);
    } finally {
      setLoading(false);
      setError("");
    }
  }

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <>
      <input
        id="username"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter your username"
      />
      <button onClick={() => handleCreateUser(sessionId)}>
        {role === UserRoles.INITIATOR ? "Create" : "Join"}
      </button>
      {error && <p>{error}</p>}
    </>
  );
}
