import { useAppContext } from "../../hooks/AppContext";
import ThemeToggle from "../ui/ThemeToggle";
import React from "react";
export default function Header() {
  const { tenant, tenantId, setTenantId, isDarkMode, toggleTheme } =
    useAppContext();
  if (!tenant) return null;

  return (
    <header className={`${isDarkMode ? "bg-gray-800" : "bg-white"} shadow`}>
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{tenant.logo}</span>
          <span className="text-xl font-semibold">{tenant.name}</span>
        </div>

        <div className="flex items-center space-x-4">
          {/* Tenant Selector */}
          <div>
            <select
              className={`rounded px-3 py-1 ${
                isDarkMode ? "bg-gray-700 text-white" : "bg-white text-gray-700"
              } border`}
              value={tenantId}
              onChange={(e) => setTenantId(e.target.value)}
              aria-label="Select tenant"
            >
              <option value="acme">ACME Corporation</option>
              <option value="startx">StartX Ventures</option>
              <option value="quantum">Quantum Industries</option>
            </select>
          </div>

          {/* Theme Toggle */}
          <ThemeToggle isDarkMode={isDarkMode} onToggle={toggleTheme} />
        </div>
      </div>
    </header>
  );
}
