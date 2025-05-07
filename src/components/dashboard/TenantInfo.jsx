import React from "react";
import { useAppContext } from "../../hooks/AppContext";
import Analytics from "./Analytics";

export default function TenantInfo() {
  const { tenant, loading, error, isDarkMode } = useAppContext();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32 w-full">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-t-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500">Loading tenant info...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-6 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg
              className="w-8 h-8 text-red-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="w-full p-6 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-gray-800">
              No Tenant Data
            </h3>
            <div className="mt-2 text-sm text-gray-600">
              Error loading tenant information.
            </div>
          </div>
        </div>
      </div>
    );
  }

  const {
    name = "Unnamed Tenant",
    config = {
      primaryColor: "#3B82F6",
      theme: "default",
      features: {},
    },
  } = tenant;

  // Ensure config.features is valid
  config.features =
    config.features && typeof config.features === "object"
      ? config.features
      : {};

  return (
    <div className="space-y-6">
      {/* Header with tenant name and styled gradient */}
      <div
        className="relative overflow-hidden rounded-xl shadow-lg"
        style={{
          background: `linear-gradient(135deg, ${
            config.primaryColor || "#3B82F6"
          } 0%, rgba(59, 130, 246, 0.8) 100%)`,
        }}
      >
        <div className="absolute inset-0 bg-grid-white/[0.1]"></div>
        <div className="relative px-3 py-7 sm:px-7 sm:py-10">
          <h1 className="text-1xl font-bold text-white">
            Welcome to {name} Dashboard
          </h1>
          {config.features.analytics && <Analytics isDarkMode={isDarkMode} />}
        </div>
      </div>
    </div>
  );
}
