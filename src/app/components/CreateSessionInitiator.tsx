"use client";

import { useState } from "react";
import { API_CONFIG } from "../lib/api-config";
import { HttpStatus, sendRequest } from "../utils/api";
import { ErrorMessages } from "../lib/types";
import { NewUserResponse } from "../lib/interfaces";
import LoadingPage from "./LoadingPage";

interface CreateSessionInitiatorProps {
  sessionId: string;
}

export default function CreateSessionInitiator({
  sessionId,
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
        { username: username }
      );

      if (!response) {
        setError(ErrorMessages.CREATE_USER_ERROR);
        return;
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
      <button onClick={() => handleCreateUser(sessionId)}>Create</button>
      {error && <p>{error}</p>}
    </>
  );
}
