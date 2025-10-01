"use client";

import { useState } from "react";
import { API_CONFIG } from "../lib/api-config";
import { HttpStatus, sendRequest } from "../utils/api";

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
    setError("");

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
    }
  };

  if (!isModalOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-stone-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg w-100">
        {/* Header */}
        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
              {/* + Icon */}
              <svg
                className="h-6 w-6 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              {/* End + Icon */}
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Add Restaurant
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Submit a restaurant of your choice!
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* End Header */}

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white px-4 pb-4 sm:p-6 sm:pb-4">
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Restaurant Name
              </label>
              <input
                id="restaurant-name"
                type="text"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="e.g. McDonald's"
              />
              {error && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  {error}
                </p>
              )}
            </div>
          </div>
          {/* End Body */}

          {/* Footer */}
          <div className="flex gap-2 mt-4 justify-center">
            <button
              type="submit"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200"
            >
              Add Restaurant
            </button>
          </div>
          {/* End Footer */}
        </form>
      </div>
    </div>
  );
}
