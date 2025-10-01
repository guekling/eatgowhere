import { SessionStatus, UserRoles } from "../lib/types";
import { useState } from "react";
import { HttpStatus, sendRequest } from "../utils/api";
import { API_CONFIG } from "../lib/api-config";
import { UpdateSessionResponse } from "../lib/interfaces";

interface SessionFooterProps {
  sessionId: string;
  userRole?: UserRoles;
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
    setError("");

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
      {userRole === UserRoles.INITIATOR &&
        sessionStatus !== SessionStatus.ENDED && (
          <>
            <button
              className="py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700 transition"
              onClick={handleEndSession}
            >
              End Session
            </button>
            {error && <p>{error}</p>}
          </>
        )}

      {sessionStatus === SessionStatus.ENDED && (
        <p className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-100 text-green-800 font-semibold shadow-sm border border-green-200">
          <span className="font-bold">Lunch Location:</span>
          <span>{chosenRestaurant}</span>
        </p>
      )}
    </section>
  );
}
