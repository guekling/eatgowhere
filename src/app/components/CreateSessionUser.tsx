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
  onUserCreated: (username: string) => void;
  onLoading?: (isLoading: boolean) => void;
}

export default function CreateSessionInitiator({
  sessionId,
  onUserCreated,
  role,
  onLoading,
}: CreateSessionInitiatorProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [username, setUsername] = useState<string>("");

  async function handleCreateUser(sessionId: string) {
    if (onLoading) {
      onLoading(true);
    } else {
      setLoading(true);
    }

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

      onUserCreated(response.username);
    } catch (error) {
      setError(ErrorMessages.CREATE_USER_ERROR);
    } finally {
      if (onLoading) {
        onLoading(false);
      } else {
        setLoading(false);
      }
      setError("");
    }
  }

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="w-full max-w-sm flex flex-col items-center">
      <input
        id="username"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter your username"
        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
      />
      <button
        className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition mb-2"
        onClick={() => handleCreateUser(sessionId)}
      >
        {role === UserRoles.INITIATOR ? "Create" : "Join"}
      </button>
      {error && (
        <div className="w-full text-center text-red-600 mt-2">{error}</div>
      )}
    </div>
  );
}
