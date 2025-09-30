import { Session } from "inspector/promises";
import { SessionStatus, UserRoles } from "../lib/types";
import { useState } from "react";
import { HttpStatus, sendRequest } from "../utils/api";
import { API_CONFIG } from "../lib/api-config";
import { UpdateSessionResponse } from "../lib/interfaces";

interface SessionFooterProps {
  sessionId: string;
  userRole: UserRoles;
  sessionStatus?: SessionStatus;
  chosenRestaurant?: string;
  onSessionEnded: () => void;
}

export default function SessionFooter({
  sessionId,
  userRole,
  sessionStatus,
  chosenRestaurant,
  onSessionEnded,
}: SessionFooterProps) {
  const [error, setError] = useState<string>("");

  const handleEndSession = async () => {
    try {
      const response: UpdateSessionResponse = await sendRequest(
        API_CONFIG.updateSession.url.replace(":sessionId", sessionId),
        API_CONFIG.updateSession.method,
        [HttpStatus.OK],
        {
          status: SessionStatus.ENDED,
          ended_at: new Date(),
        }
      );

      if (!response) {
        setError("Failed to end session. Please try again.");
        return;
      }

      onSessionEnded();
    } catch (error) {
      setError("Failed to end session. Please try again.");
    }
  };

  return (
    <section>
      {userRole === UserRoles.INITIATOR && (
        <>
          <button onClick={handleEndSession}>End Session</button>
          {error && <p>{error}</p>}
        </>
      )}

      {sessionStatus === SessionStatus.ENDED && (
        <p>Lunch Location: {chosenRestaurant}</p>
      )}
    </section>
  );
}
