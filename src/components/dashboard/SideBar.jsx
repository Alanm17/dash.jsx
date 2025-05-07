import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Settings,
  Users,
  BarChart,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAppContext } from "../../hooks/AppContext";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { tenant, isDarkMode } = useAppContext();
  const { features, primaryColor } = tenant?.config || {};

  const baseStyles = `p-2 rounded hover:bg-opacity-10 hover:bg-blue-500 cursor-pointer flex items-center space-x-2 ${
    collapsed ? "justify-center" : ""
  }`;

  // Set the back button visibility when location changes

  if (!tenant) {
    return <p>Loading...</p>;
  }

  return (
    <div
      className={`h-screen transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      } ${isDarkMode ? "bg-gray-800" : "bg-white"} shadow p-4`}
    >
      <div className="flex items-center justify-between mb-6">
        {!collapsed && <h2 className="text-xl font-semibold">Dashboard</h2>}
        <button onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? (
            <ChevronRight color={primaryColor} />
          ) : (
            <ChevronLeft color={primaryColor} />
          )}
        </button>
      </div>

      <nav>
        <ul className="space-y-2">
          <li>
            <Link to="/settings" className={baseStyles}>
              <Settings size={20} style={{ color: primaryColor }} />
              {!collapsed && <span>Settings</span>}
            </Link>
          </li>
          {features?.userManagement && (
            <li>
              <Link to="/usermanagement" className={baseStyles}>
                <Users size={20} style={{ color: primaryColor }} />
                {!collapsed && <span>User Management</span>}
              </Link>
            </li>
          )}
          {features?.analytics && (
            <li>
              <Link to="/analytics" className={baseStyles}>
                <BarChart size={20} style={{ color: primaryColor }} />
                {!collapsed && <span>Analytics</span>}
              </Link>
            </li>
          )}
          {features?.chat && (
            <li>
              <Link to="/chat" className={baseStyles}>
                <MessageSquare size={20} style={{ color: primaryColor }} />
                {!collapsed && <span>Real-Time Chat</span>}
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
}
