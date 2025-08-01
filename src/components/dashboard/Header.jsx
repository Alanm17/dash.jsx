import { useAppContext } from "../../hooks/AppContext";
import ThemeToggle from "../ui/ThemeToggle";
import React from "react";

const TENANTS = [
  { key: "acme", label: "ACME Corporation", id: 1 },
  { key: "startx", label: "StartX Ventures", id: 2 },
  { key: "quantum", label: "Quantum Industries", id: 3 },
];

export default function Header() {
  const { tenant, tenantId, setTenantId, isDarkMode, toggleTheme } =
    useAppContext();

  if (!tenant) return null;

  return (
    <header className={`${isDarkMode ? "bg-gray-800" : "bg-white"} shadow`}>
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo and Name */}
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{tenant.data.logo}</span>
          <span className="text-xl font-semibold">{tenant.data.name}</span>
        </div>

        <div className="flex items-center space-x-4">
          {/* Tenant Selector */}
          <select
            className={`rounded px-3 py-1 ${
              isDarkMode ? "bg-gray-700 text-white" : "bg-white text-gray-700"
            } border`}
            value={tenantId} // tenantId is string key now
            onChange={(e) => setTenantId(e.target.value)}
            aria-label="Select tenant"
          >
            {TENANTS.map(({ key, label }) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>

          {/* Theme Toggle */}
          <ThemeToggle isDarkMode={isDarkMode} onToggle={toggleTheme} />
        </div>
      </div>
    </header>
  );
}
