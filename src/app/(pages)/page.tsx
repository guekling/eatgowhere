"use client";

import { useState } from "react";
import NewSession from "../components/NewSession";
import CreateSessionUser from "../components/CreateSessionUser";
import ShareSession from "../components/ShareSession";
import { UserRoles } from "../lib/types";

export default function Home() {
  const [sessionId, setSessionId] = useState<string>("");
  const [username, setUsername] = useState<string>("");

  function handleSessionCreated(sessionId: string) {
    setSessionId(sessionId);
  }

  function handleUserCreated(username: string) {
    setUsername(username);
  }

  return (
    <main>
      {!sessionId && <NewSession onSessionCreated={handleSessionCreated} />}

      {sessionId && !username && (
        <CreateSessionUser
          sessionId={sessionId}
          onUserCreated={handleUserCreated}
          role={UserRoles.INITIATOR}
        />
      )}

      {sessionId && username && (
        <ShareSession sessionId={sessionId} username={username} />
      )}
    </main>
  );
}
