"use client";

import { send } from "process";
import { useState } from "react";
import { API_CONFIG } from "../lib/api-config";
import { HttpStatus, sendRequest } from "../utils/api";
import LoadingPage from "./LoadingPage";

interface CreateRestaurantModalProps {
  isModalOpen: boolean;
  sessionId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateRestaurantModal({
  isModalOpen,
  sessionId,
  onClose,
  onSuccess,
}: CreateRestaurantModalProps) {
  const [restaurantName, setRestaurantName] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await sendRequest(
        API_CONFIG.createRestaurant.url.replace(":sessionId", sessionId),
        API_CONFIG.createRestaurant.method,
        [HttpStatus.CREATED],
        { name: restaurantName }
      );

      if (!response) {
        setError("Failed to add restaurant. Please try again.");
        return;
      }

      setRestaurantName("");
      onClose();
      onSuccess();
    } catch (error) {
      setError("Failed to add restaurant. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingPage />;
  }

  if (!isModalOpen) {
    return null;
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Restaurant Name</label>
        <input
          type="text"
          value={restaurantName}
          onChange={(e) => setRestaurantName(e.target.value)}
          required
        />
        <button type="submit">Add Restaurant</button>
        <button type="button" onClick={onClose}>
          Cancel
        </button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
}
