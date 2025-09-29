"use client";

import { useState } from "react";
import { API_CONFIG } from "../lib/api-config";
import { HttpStatus, sendRequest } from "../utils/api";
import { ErrorMessages } from "../lib/types";
import { NewSessionResponse } from "../lib/interfaces";
import LoadingPage from "./LoadingPage";

interface NewSessionProps {
  onSessionCreated: (sessionId: string) => void;
}

export default function NewSession({ onSessionCreated }: NewSessionProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  async function handleCreateSession() {
    setLoading(true);
    try {
      const response: NewSessionResponse = await sendRequest(
        API_CONFIG.createSession.url,
        API_CONFIG.createSession.method,
        [HttpStatus.CREATED]
      );

      if (!response) {
        setError(ErrorMessages.CREATE_SESSION_ERROR);
        return;
      }

      onSessionCreated(response.id);
    } catch (error) {
      setError(ErrorMessages.CREATE_SESSION_ERROR);
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
      <button onClick={handleCreateSession}>Start New Session</button>
      {error && <p>{error}</p>}
    </>
  );
}
