import React from "react";
import { useAppContext } from "../../hooks/AppContext";
import GoBackBtn from "../ui/GoBackBtn";

function Settings() {
  const { tenant, isDarkMode } = useAppContext();
  const { features } = tenant?.config || {};

  return (
    <div
      className={` shadow-md overflow-hidden ${
        isDarkMode ? "bg-gray-800" : "bg-white"
      }`}
    >
      <div
        className={`px-6 py-5 border-b ${
          isDarkMode ? "border-gray-700" : "border-gray-200"
        }`}
      >
        {" "}
        <GoBackBtn />
        <h3
          className={`text-lg font-semibold ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Configuration Settings
        </h3>
      </div>

      <div className="px-6 py-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Theme Card */}
          <div
            className={`p-4 rounded-lg ${
              isDarkMode ? "bg-gray-700" : "bg-gray-50"
            }`}
          >
            <div className="flex items-center mb-4">
              <span
                className={`ml-2 font-mono text-sm ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                primary color: {tenant?.config?.primaryColor || "#3B82F6"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      {features && Object.keys(features).length > 0 && (
        <div
          className={`px-6 py-5 border-t ${
            isDarkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <h4
            className={`mb-4 font-semibold ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Enabled Features
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(features).map(([feature, enabled]) => (
              <div
                key={feature}
                className={`flex items-center p-3 rounded-lg ${
                  isDarkMode
                    ? enabled
                      ? "bg-green-900/30"
                      : "bg-red-900/30"
                    : enabled
                    ? "bg-green-50"
                    : "bg-red-50"
                }`}
              >
                <div
                  className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                    enabled
                      ? isDarkMode
                        ? "bg-green-500"
                        : "bg-green-100"
                      : isDarkMode
                      ? "bg-red-500"
                      : "bg-red-100"
                  }`}
                >
                  {enabled ? (
                    <svg
                      className={`w-4 h-4 ${
                        isDarkMode ? "text-green-100" : "text-green-600"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      className={`w-4 h-4 ${
                        isDarkMode ? "text-red-100" : "text-red-600"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <div className="ml-3">
                  <span
                    className={`text-sm font-medium ${
                      isDarkMode
                        ? enabled
                          ? "text-green-100"
                          : "text-red-100"
                        : enabled
                        ? "text-green-800"
                        : "text-red-800"
                    }`}
                  >
                    {feature}
                  </span>
                  <p
                    className={`text-xs ${
                      isDarkMode
                        ? "text-gray-400"
                        : enabled
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {enabled ? "Enabled" : "Disabled"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Settings;
