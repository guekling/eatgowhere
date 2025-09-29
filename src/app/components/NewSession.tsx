"use client";

import { useState } from "react";
import { API_CONFIG } from "../lib/api-config";
import { HttpStatus, sendRequest } from "../utils/api";
import { ErrorMessages } from "../lib/types";

export default function NewSession() {
  const [error, setError] = useState("");

  async function handleCreateSession() {
    try {
      const response = await sendRequest(API_CONFIG.createSession.url, "POST", [
        HttpStatus.CREATED,
      ]);

      if (!response) {
        setError(ErrorMessages.CREATE_SESSION_ERROR);
        return;
      }

      console.log("Session created:", response);
    } catch (error) {
      setError(ErrorMessages.CREATE_SESSION_ERROR);
    }
  }

  return (
    <>
      <button onClick={handleCreateSession}>Create New Session</button>
      {error && <p>{error}</p>}
    </>
  );
}
