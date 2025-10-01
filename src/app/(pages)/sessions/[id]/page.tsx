"use client";

import CreateRestaurantModal from "@/app/components/CreateRestaurantModal";
import LoadingPage from "@/app/components/LoadingPage";
import SessionFooter from "@/app/components/SessionFooter";
import SessionInvalidPage from "@/app/components/SessionInvalidPage";
import SessionUsersTable from "@/app/components/SessionUsersTable";
import { UserAttributes } from "@/app/database/models/user";
import { API_CONFIG } from "@/app/lib/api-config";
import {
  AuthResponse,
  GetSessionInfoResponse,
  SessionInfo,
} from "@/app/lib/interfaces";
import { SessionIdPathParams } from "@/app/lib/validators";
import { HttpStatus, sendRequest } from "@/app/utils/api";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function Session() {
  const params = useParams<SessionIdPathParams>();
  const { id: sessionId } = params;

  const [isUserAuthenticated, setIsUserAuthenticated] =
    useState<boolean>(false);
  const [user, setUser] = useState<UserAttributes | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);
  const [showCreateRestaurantModal, setShowCreateRestaurantModal] =
    useState<boolean>(false);

  const getSessionInfo = useCallback(async () => {
    setLoading(true);
    try {
      const response: GetSessionInfoResponse = await sendRequest(
        API_CONFIG.getSession.url.replace(":sessionId", sessionId),
        API_CONFIG.getSession.method,
        [HttpStatus.OK]
      );

      if (!response) {
        return;
      }

      setSessionInfo(response);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

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

        if (response.session_id !== sessionId) {
          setIsUserAuthenticated(false);
          return;
        }

        setIsUserAuthenticated(true);
        setUser(response);
      } catch (error) {
        setIsUserAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (isUserAuthenticated) {
      getSessionInfo();
    }
  }, [isUserAuthenticated, getSessionInfo]);

  useEffect(() => {
    if (isUserAuthenticated && sessionInfo && user) {
      if (!sessionInfo.users[user.id]?.restaurant) {
        setShowCreateRestaurantModal(true);
      }
    }
  }, [isUserAuthenticated, sessionInfo, user]);

  if (loading) {
    return <LoadingPage />;
  }

  if (!isUserAuthenticated) {
    return <SessionInvalidPage />;
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
          <h1 className="text-2xl font-bold mb-4">Hello, {user?.username}</h1>
          <p className="mb-6 text-gray-700 text-center">
            {!sessionInfo?.chosen_restaurant
              ? "Just one second, collecting restaurant suggestions..."
              : "We've chosen a restaurant!"}
          </p>

          <section className="w-full max-w-4xl">
            <SessionUsersTable
              users={sessionInfo?.users}
              chosenRestaurant={sessionInfo?.chosen_restaurant}
            />
          </section>

          <SessionFooter
            sessionId={sessionId}
            userRole={user?.role!}
            sessionStatus={sessionInfo?.status}
            chosenRestaurant={sessionInfo?.chosen_restaurant}
            onSessionEnded={getSessionInfo}
          />
        </div>
      </div>

      <CreateRestaurantModal
        isModalOpen={showCreateRestaurantModal}
        sessionId={sessionId}
        onClose={() => setShowCreateRestaurantModal(false)}
        onSuccess={getSessionInfo}
      />
    </main>
  );
}
