import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import PropTypes from "prop-types";

const AppContext = createContext();
const API_BASE_URL = "http://localhost:3001"; // Correct port

export const AppProvider = ({ children }) => {
  const [tenantId, setTenantId] = useState("acme");
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [analyticsData, setAnalyticsData] = useState(null);

  const tenantFetched = useRef(false);
  const usersFetched = useRef(false);
  const analyticsFetched = useRef(false);

  // Fetch tenant data
  useEffect(() => {
    const fetchTenant = async () => {
      if (!tenantId || tenantFetched.current) return;

      try {
        const t1 = performance.now();
        const res = await fetch(`${API_BASE_URL}/api/tenant`, {
          headers: { "x-tenant-id": tenantId },
        });
        const t2 = performance.now();
        console.log(`Tenant fetch took ${t2 - t1}ms`);

        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

        const data = await res.json();
        setTenant({
          ...data,
          config: {
            theme: data.config?.theme || "light",
            features: {
              analytics: !!data.config?.features?.analytics,
              userManagement: !!data.config?.features?.userManagement,
              notifications: !!data.config?.features?.notifications,
              chat: !!data.config?.features?.chat,
            },
          },
        });
        tenantFetched.current = true;
      } catch (err) {
        console.error("Failed to fetch tenant:", err);
        setError("Failed to fetch tenant");
      } finally {
        setLoading(false);
      }
    };

    fetchTenant();
  }, [tenantId]);

  // Fetch users when tenant is available and user management is enabled
  useEffect(() => {
    const fetchUsers = async () => {
      if (
        !tenant ||
        usersFetched.current ||
        !tenant.config.features.userManagement
      )
        return;

      try {
        const t1 = performance.now();
        const res = await fetch(`${API_BASE_URL}/api/users`, {
          headers: { "x-tenant-id": tenantId },
        });
        const t2 = performance.now();
        console.log(`Users fetch took ${t2 - t1}ms`);

        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

        const data = await res.json();
        setUsers(Array.isArray(data) ? data : []);
        usersFetched.current = true;
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, [tenantId, tenant]);

  // Fetch analytics data when tenant is available and analytics is enabled
  useEffect(() => {
    const fetchAnalytics = async () => {
      if (
        !tenant ||
        analyticsFetched.current ||
        !tenant.config.features.analytics
      )
        return;

      try {
        const t1 = performance.now();
        const res = await fetch(`${API_BASE_URL}/api/analytics`, {
          headers: { "x-tenant-id": tenantId },
        });
        const t2 = performance.now();
        console.log(`Analytics fetch took ${t2 - t1}ms`);

        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

        const data = await res.json();
        setAnalyticsData(
          typeof data === "string" ? data : data ?? "No analytics"
        );
        analyticsFetched.current = true;
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      }
    };

    fetchAnalytics();
  }, [tenantId, tenant]);

  // Toggle dark/light theme
  const toggleTheme = () => {
    if (!tenant) return;
    const newTheme = tenant.config.theme === "dark" ? "light" : "dark";
    setTenant((prev) => ({
      ...prev,
      config: { ...prev.config, theme: newTheme },
    }));
  };

  // Apply theme effect
  useEffect(() => {
    if (!tenant) return;

    const root = document.documentElement;
    const isDark = tenant.config.theme === "dark";

    if (isDark) {
      root.classList.add("dark");
      document.body.style.backgroundColor = "#1f2937"; // Tailwind gray-800
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      document.body.style.backgroundColor = "#ffffff";
      localStorage.setItem("theme", "light");
    }
  }, [tenant]);

  // Reset fetch flags when tenant ID changes
  useEffect(() => {
    tenantFetched.current = false;
    usersFetched.current = false;
    analyticsFetched.current = false;
  }, [tenantId]);

  return (
    <AppContext.Provider
      value={{
        tenantId,
        setTenantId,
        tenant,
        loading,
        error,
        toggleTheme,
        isDarkMode: tenant?.config?.theme === "dark",
        users,
        setUsers,
        analyticsData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAppContext = () => useContext(AppContext);
