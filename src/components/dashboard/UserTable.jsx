import { useState } from "react";
import React from "react";
import GoBackBtn from "../ui/GoBackBtn";

import { useAppContext } from "../../hooks/AppContext";
import { useThemeClasses } from "../../hooks/useThemeClasses";

export default function UserTable() {
  const { isDarkMode, users } = useAppContext();
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedUsers = [...users].sort((a, b) => {
    if (sortConfig.key) {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
    }
    return 0;
  });

  const normalizedSearchTerm = searchTerm.trim().toLowerCase();

  const filteredUsers = sortedUsers.filter((user) => {
    const name = user.name.trim().toLowerCase();
    const email = user.email.trim().toLowerCase();
    return (
      name.includes(normalizedSearchTerm) ||
      email.includes(normalizedSearchTerm)
    );
  });

  // Theme colors
  const { bgMain, bgCard, textColor, textSecondary, borderColor, hoverBg } =
    useThemeClasses();

  return (
    <div className={`mt-4 sm:mt-6 p-4 sm:p-6 rounded-lg ${bgMain}`}>
      <GoBackBtn />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <h3 className={`text-lg sm:text-xl font-semibold ${textColor}`}>
          User Management
        </h3>
        <div className="relative">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full sm:w-64 px-4 py-2 rounded-lg border ${borderColor} ${bgCard} ${textColor} focus:outline-none focus:ring-2 ${
              isDarkMode ? "focus:ring-blue-500" : "focus:ring-blue-300"
            }`}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg shadow-sm">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className={isDarkMode ? "bg-gray-700" : "bg-gray-50"}>
            <tr>
              <th
                className="px-4 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort("name")}
              >
                <div className="flex items-center">
                  Name
                  {sortConfig.key === "name" && (
                    <span className="ml-1">
                      {sortConfig.direction === "ascending" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th
                className="px-4 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort("email")}
              >
                <div className="flex items-center">
                  Email
                  {sortConfig.key === "email" && (
                    <span className="ml-1">
                      {sortConfig.direction === "ascending" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th
                className="px-4 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort("status")}
              >
                <div className="flex items-center">
                  Status
                  {sortConfig.key === "status" && (
                    <span className="ml-1">
                      {sortConfig.direction === "ascending" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y ${borderColor} ${bgCard}`}>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <tr key={index} className={hoverBg}>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-gray-600 font-medium">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className={`text-sm font-medium ${textColor}`}>
                          {user.name}
                        </div>
                        <div className={`text-sm ${textSecondary}`}>
                          {user.role || "User"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td
                    className={`px-4 sm:px-6 py-4 whitespace-nowrap text-sm ${textColor}`}
                  >
                    {user.email}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        user.status === "Active"
                          ? isDarkMode
                            ? "bg-green-900 text-green-200"
                            : "bg-green-100 text-green-800"
                          : isDarkMode
                          ? "bg-yellow-900 text-yellow-200"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      className={`mr-2 ${
                        isDarkMode
                          ? "text-blue-400 hover:text-blue-300"
                          : "text-blue-600 hover:text-blue-800"
                      }`}
                    >
                      Edit
                    </button>
                    <button
                      className={
                        isDarkMode
                          ? "text-red-400 hover:text-red-300"
                          : "text-red-600 hover:text-red-800"
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className={`px-4 sm:px-6 py-4 text-center ${textColor}`}
                >
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filteredUsers.length > 0 && (
        <div
          className={`flex items-center justify-between mt-4 px-4 sm:px-6 py-3 ${bgCard} border-t ${borderColor}`}
        >
          <div className={`text-sm ${textSecondary}`}>
            Showing <span className="font-medium">1</span> to{" "}
            <span className="font-medium">
              {Math.min(10, filteredUsers.length)}
            </span>{" "}
            of <span className="font-medium">{filteredUsers.length}</span> users
          </div>
          <div className="flex space-x-2">
            <button
              disabled
              className={`px-3 py-1 rounded-md ${
                isDarkMode
                  ? "bg-gray-600 text-gray-400"
                  : "bg-gray-100 text-gray-600"
              } cursor-not-allowed`}
            >
              Previous
            </button>
            <button
              className={`px-3 py-1 rounded-md ${
                isDarkMode
                  ? "bg-gray-600 text-white hover:bg-gray-500"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
