"use client";

import CreateSessionUser from "@/app/components/CreateSessionUser";
import { useParams, useRouter } from "next/navigation";
import { SessionIdPathParams } from "@/app/lib/validators";
import { UserRoles } from "@/app/lib/types";
import { useEffect, useState } from "react";
import { HttpStatus, sendRequest } from "@/app/utils/api";
import { API_CONFIG } from "@/app/lib/api-config";
import SessionInvalidPage from "@/app/components/SessionInvalidPage";
import LoadingPage from "@/app/components/LoadingPage";
import { AuthResponse } from "@/app/lib/interfaces";

interface isUserAuthenticatedState {
  isAuthenticated: boolean;
  sessionId: string;
}

export default function Join() {
  const router = useRouter();

  const params = useParams<SessionIdPathParams>();
  const { id: sessionId } = params;

  const [isSessionValid, setIsSessionValid] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isUserAuthenticated, setIsUserAuthenticated] =
    useState<isUserAuthenticatedState>({
      isAuthenticated: false,
      sessionId: "",
    });

  function handleUserCreated(_username: string) {
    router.push(`/sessions/${sessionId}`);
  }

  useEffect(() => {
    const validateSession = async () => {
      try {
        const response = await sendRequest(
          API_CONFIG.validateSession.url.replace(":sessionId", sessionId),
          API_CONFIG.validateSession.method,
          [HttpStatus.NO_CONTENT]
        );

        if (!response) {
          setIsSessionValid(false);
        } else {
          setIsSessionValid(true);
        }
      } catch (error) {
        setIsSessionValid(false);
      }
    };

    const checkAuth = async () => {
      try {
        const response: AuthResponse = await sendRequest(
          API_CONFIG.auth.url,
          API_CONFIG.auth.method,
          [HttpStatus.OK]
        );

        if (!response) {
          return;
        }

        if (response.session_id === sessionId) {
          // user has already joined this session, route to session page
          router.push(`/sessions/${sessionId}`);
        } else {
          // @todo
          // user is authenticated but for a different session, modal popup to confirm
          // leave current session and join new session? - yes: logout current session, no: stay
          setIsUserAuthenticated({
            isAuthenticated: true,
            sessionId: response.session_id,
          });
        }
      } catch (error) {
        // do nothing
      }
    };

    const runChecks = async () => {
      setLoading(true);
      await Promise.all([validateSession(), checkAuth()]);
      setLoading(false);
    };

    runChecks();
  }, [sessionId]);

  if (loading) {
    return <LoadingPage />;
  }

  if (!isSessionValid) {
    return <SessionInvalidPage />;
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm flex flex-col items-center">
        <p className="mb-6 text-gray-700 text-center">
          Where to go for lunch? <br /> Join now to submit a location of your
          choice!
        </p>
        <CreateSessionUser
          sessionId={sessionId}
          role={UserRoles.PARTICIPANT}
          onUserCreated={handleUserCreated}
          onLoading={setLoading}
        />
      </div>
    </main>
  );
}
