"use client";

import { useState } from "react";
import NewSession from "../components/NewSession";
import CreateSessionInitiator from "../components/CreateSessionInitiator";

export default function Home() {
  const [sessionId, setSessionId] = useState<string>("");

  function handleSessionCreated(sessionId: string) {
    setSessionId(sessionId);
  }

  return (
    <main>
      {!sessionId && <NewSession onSessionCreated={handleSessionCreated} />}

      {sessionId && <CreateSessionInitiator sessionId={sessionId} />}
    </main>
  );
}
