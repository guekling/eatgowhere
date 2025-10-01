"use client";

import { useEffect, useState } from "react";
import NewSession from "../components/NewSession";
import CreateSessionUser from "../components/CreateSessionUser";
import ShareSession from "../components/ShareSession";
import { UserRoles } from "../lib/types";
import { API_CONFIG } from "../lib/api-config";
import { HttpStatus, sendRequest } from "../utils/api";
import { AuthResponse } from "../lib/interfaces";
import LoadingPage from "../components/LoadingPage";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const [sessionId, setSessionId] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [isUserAuthenticated, setIsUserAuthenticated] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  function handleSessionCreated(sessionId: string) {
    setSessionId(sessionId);
  }

  function handleUserCreated(username: string) {
    setUsername(username);
  }

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      try {
        const response: AuthResponse = await sendRequest(
          API_CONFIG.auth.url,
          API_CONFIG.auth.method,
          [HttpStatus.OK]
        );

        if (!response) {
          return;
        }

        setIsUserAuthenticated(true);
        setSessionId(response.session_id);
      } catch (error) {
        setIsUserAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (isUserAuthenticated && sessionId) {
      setLoading(true);
      router.push(`/sessions/${sessionId}`);
    }
  }, [isUserAuthenticated, sessionId]);

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
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
