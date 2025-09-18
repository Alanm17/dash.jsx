import { useAppContext } from "../../hooks/AppContext";
import ThemeToggle from "../ui/ThemeToggle";
import React from "react";

const TENANTS = [
  { key: 1, label: "ACME Corporation" },
  { key: 2, label: "SpaceX Corporation" },
  { key: 3, label: "Alanx Corporation" },
];

export default function Header() {
  const { tenant, tenantId, setTenantId, isDarkMode, toggleTheme } =
    useAppContext();

  return (
    <header className={`${isDarkMode ? "bg-gray-800" : "bg-white"} shadow`}>
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo and Name */}
        <div className="flex items-center space-x-2">
          {tenant ? (
            <>
              <span className="text-2xl">{tenant.logo || "🏢"}</span>
              <span className="text-xl font-semibold">{tenant.name}</span>
            </>
          ) : (
            <span className="text-gray-500 italic">Loading tenant…</span>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {/* Tenant Selector (always visible) */}
          <select
            className={`rounded px-3 py-1 ${
              isDarkMode ? "bg-gray-700 text-white" : "bg-white text-gray-700"
            } border`}
            value={tenantId}
            onChange={(e) => setTenantId(Number(e.target.value))} // 👈 ensure number
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
