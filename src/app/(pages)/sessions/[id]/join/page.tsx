"use client";

import CreateSessionUser from "@/app/components/CreateSessionUser";
import { useParams } from "next/navigation";
import { SessionIdPathParams } from "@/app/lib/validators";
import { UserRoles } from "@/app/lib/types";
import { useEffect, useState } from "react";
import { HttpStatus, sendRequest } from "@/app/utils/api";
import { API_CONFIG } from "@/app/lib/api-config";
import SessionInvalidPage from "@/app/components/SessionInvalidPage";
import LoadingPage from "@/app/components/LoadingPage";

export default function Join() {
  const params = useParams<SessionIdPathParams>();
  const { id: sessionId } = params;

  const [isSessionValid, setIsSessionValid] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const validateSession = async () => {
      setLoading(true);
      try {
        const response = await sendRequest(
          API_CONFIG.validateSession.url.replace(":sessionId", sessionId),
          API_CONFIG.validateSession.method,
          [HttpStatus.NO_CONTENT]
        );

        if (!response) {
          setIsSessionValid(false);
        }

        setIsSessionValid(true);
      } catch (error) {
        setIsSessionValid(false);
      } finally {
        setLoading(false);
      }
    };

    validateSession();
  }, [sessionId]);

  if (loading) {
    return <LoadingPage />;
  }

  if (!isSessionValid) {
    return <SessionInvalidPage />;
  }

  return (
    <main>
      <h1>
        Where to go for lunch? Join now to submit a location of your choice!
      </h1>
      <CreateSessionUser sessionId={sessionId} role={UserRoles.PARTICIPANT} />
    </main>
  );
}
