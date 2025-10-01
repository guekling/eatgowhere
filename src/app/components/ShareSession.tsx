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
    <div className="max-w-md w-full flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Hello, {username}</h1>
      <p className="mb-6 text-gray-700 text-center">
        Share this invite link with your friends
      </p>
      <button
        className="w-full flex items-center justify-between px-4 py-3 bg-blue-100 rounded-lg border border-blue-300 hover:bg-blue-200 transition mb-2"
        onClick={handleCopyLink}
      >
        {isCopySuccessful ? (
          <span className="text-green-600 text-center">Copied!</span>
        ) : (
          <span className="truncate text-blue-700 text-left">{inviteLink}</span>
        )}
        {/* Heroicons Link SVG */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="ml-2 h-6 w-6 text-blue-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.828 10.172a4 4 0 010 5.656l-3.536 3.536a4 4 0 01-5.656-5.656l1.414-1.414m6.364-6.364a4 4 0 015.656 5.656l-1.414 1.414"
          />
        </svg>
        {/* End Heroicons Link SVG */}
      </button>
      <button
        className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition mb-2"
        onClick={() => router.push(`/sessions/${sessionId}`)}
      >
        View Session Details
      </button>
    </div>
  );
}
