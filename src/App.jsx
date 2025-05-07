import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Dashboard from "./components/dashboard/Dashboard";
import UserTable from "./components/dashboard/UserTable";
import Analytics from "./components/dashboard/Analytics";
import Settings from "./components/dashboard/Settings";
import ChatPanel from "./components/dashboard/ChatPanel";

// Make sure to import AppProvider
import { AppProvider } from "./hooks/AppContext";

function App() {
  return (
    <Router>
      <AppProvider>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/usermanagement" element={<UserTable />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/chat" element={<ChatPanel />} />
        </Routes>
      </AppProvider>
    </Router>
  );
}

export default App;
