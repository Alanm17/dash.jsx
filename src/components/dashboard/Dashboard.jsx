import React from "react";

import Sidebar from "./SideBar";
import TenantInfo from "./tenantInfo";
import { useAppContext } from "../../hooks/AppContext";
import Header from "./Header";

export default function Dashboard() {
  const { setTenantId, tenant, loading, toggleTheme, isDarkMode } =
    useAppContext();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-lg dark:text-white">Loading tenant data...</div>
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-lg text-red-500 dark:text-red-400">
          Tenant not found
        </div>
      </div>
    );
  }

  const { config } = tenant;

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <Header
        tenant={tenant}
        setTenantId={setTenantId}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
          {/* Sidebar - Mobile first: hidden, then shown on md+ */}
          <div className="md:w-1/4 lg:w-1/5">
            <Sidebar config={config} isDarkMode={isDarkMode} />
          </div>

          {/* Main Panel */}
          <div className="flex-1">
            <div
              className={`${
                isDarkMode ? "bg-gray-800" : "bg-white"
              } rounded-lg shadow p-4 sm:p-6`}
            >
              <TenantInfo tenant={tenant} isDarkMode={isDarkMode} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
