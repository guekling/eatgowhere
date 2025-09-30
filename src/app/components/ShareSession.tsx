"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface ShareSessionProps {
  sessionId: string;
  username: string;
}

export default function ShareSession({
  sessionId,
  username,
}: ShareSessionProps) {
  const router = useRouter();

  const inviteLink = `${window.location.origin}/sessions/${sessionId}/join`;

  const [isCopySuccessful, setIsCopySuccessful] = useState<boolean>(false);

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setIsCopySuccessful(true);
      setTimeout(() => setIsCopySuccessful(false), 1500); // remove message after 1.5s
    } catch (error) {
      setIsCopySuccessful(false);
    }
  }

  return (
    <>
      <h1>Hello, {username}</h1>
      <p>Share this invite link with your friends</p>
      <button onClick={handleCopyLink}>{inviteLink}</button>
      {isCopySuccessful && <p>Copied!</p>}
      <button onClick={() => router.push(`/sessions/${sessionId}`)}>
        View Session Details
      </button>
    </>
  );
}
