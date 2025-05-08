import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import PropTypes from "prop-types";

const AppContext = createContext();
const API_BASE_URL = "http://localhost:3001"; // Base API URL

export const AppProvider = ({ children }) => {
  const [tenantId, setTenantId] = useState("acme");
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [analyticsData, setAnalyticsData] = useState(null);

  // Track fetch status for each data type
  const fetchStatus = useRef({
    tenant: false,
    users: false,
    analytics: false,
  });

  // Abort controllers for cancelling fetch requests
  const abortControllers = useRef({});

  // Reset all fetch statuses and abort any pending requests
  const resetFetchState = useCallback(() => {
    // Abort any ongoing requests
    Object.values(abortControllers.current).forEach((controller) => {
      if (controller) {
        try {
          controller.abort();
        } catch (err) {
          console.error("Error aborting request:", err);
        }
      }
    });

    // Reset fetch status
    fetchStatus.current = {
      tenant: false,
      users: false,
      analytics: false,
    };

    // Reset abort controllers
    abortControllers.current = {};
  }, []);

  // Generic fetch function with error handling and performance tracking
  const fetchData = useCallback(
    async (endpoint, options = {}) => {
      const controller = new AbortController();
      const fetchKey = endpoint.split("/").pop(); // Use endpoint as key (tenant, users, analytics)

      abortControllers.current[fetchKey] = controller;

      const t1 = performance.now();

      try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          headers: {
            "x-tenant-id": tenantId,
            ...options.headers,
          },
          signal: controller.signal,
          ...options,
        });

        const t2 = performance.now();
        console.log(`${fetchKey} fetch took ${t2 - t1}ms`);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json();
      } catch (err) {
        // Ignore AbortError as it's expected when we cancel requests
        if (err.name !== "AbortError") {
          console.error(`Failed to fetch ${fetchKey}:`, err);
          throw err;
        }
      } finally {
        delete abortControllers.current[fetchKey];
      }
    },
    [tenantId]
  );

  // 1. Fetch tenant data
  useEffect(() => {
    let isMounted = true;

    const fetchTenant = async () => {
      if (fetchStatus.current.tenant || !tenantId) return;

      try {
        setLoading(true);
        setError(null);

        const data = await fetchData("/api/tenant");

        if (!isMounted) return;

        setTenant(
          data && typeof data === "object"
            ? {
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
              }
            : {
                name: "Fallback Tenant",
                config: {
                  theme: "light",
                  features: {
                    analytics: false,
                    userManagement: false,
                    notifications: false,
                    chat: false,
                  },
                },
              }
        );

        fetchStatus.current.tenant = true;
      } catch (err) {
        if (!isMounted) return;
        console.error("error", err);
        setError("Failed to fetch tenant data");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchTenant();

    return () => {
      isMounted = false;
    };
  }, [tenantId, fetchData]);

  // 2. Fetch users when tenant is available and user management is enabled
  useEffect(() => {
    let isMounted = true;

    const fetchUsers = async () => {
      if (fetchStatus.current.users || !tenantId) return;

      try {
        const data = await fetchData("/api/users");

        if (!isMounted) return;

        setUsers(Array.isArray(data) ? data : []);
        fetchStatus.current.users = true;
      } catch (err) {
        console.error("error", err);
        if (!isMounted) return;
        setError((prev) => prev || "Failed to fetch users data");
      }
    };

    // Only fetch users if tenant is loaded and userManagement feature is enabled
    if (tenant && tenant.config.features.userManagement) {
      fetchUsers();
    }

    return () => {
      isMounted = false;
    };
  }, [tenantId, tenant, fetchData]);

  // 3. Fetch analytics data when tenant is available and analytics is enabled
  useEffect(() => {
    let isMounted = true;

    const fetchAnalytics = async () => {
      if (fetchStatus.current.analytics || !tenantId) return;

      try {
        const data = await fetchData("/api/analytics");

        if (!isMounted) return;

        setAnalyticsData(
          typeof data === "string" ? data : data ?? "No analytics"
        );
        fetchStatus.current.analytics = true;
      } catch (err) {
        console.error("error", err);
        if (!isMounted) return;
        setError((prev) => prev || "Failed to fetch analytics data");
      }
    };

    // Only fetch analytics if tenant is loaded and analytics feature is enabled
    if (tenant && tenant.config.features.analytics) {
      fetchAnalytics();
    }

    return () => {
      isMounted = false;
    };
  }, [tenantId, tenant, fetchData]);

  // 4. Toggle dark/light theme
  const toggleTheme = useCallback(() => {
    if (!tenant) return;

    const newTheme = tenant.config.theme === "dark" ? "light" : "dark";
    setTenant((prev) => ({
      ...prev,
      config: { ...prev.config, theme: newTheme },
    }));
  }, [tenant]);

  // 5. Apply theme effect
  useEffect(() => {
    if (!tenant) return;

    const isDark = tenant.config.theme === "dark";

    // Use a safer way to manipulate the DOM that works with SSR
    if (typeof window !== "undefined") {
      const root = document.documentElement;

      if (isDark) {
        root.classList.add("dark");
        document.body.style.backgroundColor = "#1f2937"; // Tailwind gray-800
        localStorage.setItem("theme", "dark");
      } else {
        root.classList.remove("dark");
        document.body.style.backgroundColor = "#ffffff";
        localStorage.setItem("theme", "light");
      }
    }
  }, [tenant]);

  // 6. Reset fetch flags when tenant ID changes
  useEffect(() => {
    resetFetchState();
  }, [tenantId, resetFetchState]);

  // 7. Initialize theme from localStorage on mount (if available)
  useEffect(() => {
    if (typeof window !== "undefined" && !tenant) {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme && tenant) {
        setTenant((prev) => ({
          ...prev,
          config: {
            ...(prev?.config || {}),
            theme: savedTheme,
          },
        }));
      }
    }
  }, []);

  const contextValue = {
    tenantId,
    setTenantId,
    tenant,
    loading,
    error,
    clearError: () => setError(null),
    toggleTheme,
    isDarkMode: tenant?.config?.theme === "dark",
    users,
    setUsers,
    analyticsData,
    refreshData: resetFetchState,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
