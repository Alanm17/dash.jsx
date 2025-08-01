import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import PropTypes from "prop-types";

const AppContext = createContext();
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

console.log("API Base URL:", import.meta.env.VITE_BACKEND_URL);

// AppProvider wraps your app and provides global state and actions
export const AppProvider = ({ children }) => {
  const [tenantId, setTenantId] = useState("acme"); // <-- string key for tenant
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [analyticsData, setAnalyticsData] = useState(null);

  // Flags to prevent duplicate fetching on same tenantId
  const tenantFetched = useRef(false);
  const usersFetched = useRef(false);
  const analyticsFetched = useRef(false);

  // Helper to fetch JSON and handle errors
  const fetchData = async (endpoint) => {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: { "x-tenant-id": tenantId },
    });
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    return res.json();
  };

  // 1. Fetch tenant data
  useEffect(() => {
    if (!tenantId || tenantFetched.current) return;

    const fetchTenant = async () => {
      setLoading(true);
      try {
        const data = await fetchData("api/tenant");

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
            primaryColor: data.config?.primaryColor || "#3b82f6",
          },
        });

        tenantFetched.current = true;
        setError(null);
      } catch (err) {
        console.error("Failed to fetch tenant:", err);
        setError("Failed to fetch tenant");
      } finally {
        setLoading(false);
      }
    };

    fetchTenant();
  }, [tenantId]);

  // 2. Fetch users if feature enabled
  useEffect(() => {
    if (!tenantId || usersFetched.current) return;
    if (!tenant?.config?.features?.userManagement) return;

    const fetchUsers = async () => {
      try {
        const data = await fetchData("/api/users");
        setUsers(Array.isArray(data) ? data : []);
        usersFetched.current = true;
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };

    fetchUsers();
  }, [tenantId, tenant]);

  // 3. Fetch analytics if feature enabled
  useEffect(() => {
    if (!tenantId || analyticsFetched.current) return;
    if (!tenant?.config?.features?.analytics) return;

    const fetchAnalytics = async () => {
      try {
        const data = await fetchData("/api/analytics");
        setAnalyticsData(
          typeof data === "string" ? data : data ?? "No analytics"
        );
        analyticsFetched.current = true;
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
      }
    };

    fetchAnalytics();
  }, [tenantId, tenant]);

  // 4. Toggle theme light/dark
  const toggleTheme = () => {
    if (!tenant) return;
    const newTheme = tenant.config.theme === "dark" ? "light" : "dark";

    setTenant((prev) => ({
      ...prev,
      config: { ...prev.config, theme: newTheme },
    }));
  };

  // 5. Apply theme to document
  useEffect(() => {
    if (!tenant) return;

    const root = document.documentElement;
    const isDark = tenant.config.theme === "dark";

    if (isDark) {
      root.classList.add("dark");
      document.body.style.backgroundColor = "#1f2937";
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      document.body.style.backgroundColor = "#ffffff";
      localStorage.setItem("theme", "light");
    }
  }, [tenant]);

  // 6. Reset fetch flags on tenantId change
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
