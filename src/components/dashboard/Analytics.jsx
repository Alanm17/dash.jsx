import React from "react";

import {
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Scatter,
  ResponsiveContainer,
} from "recharts";
import { useAppContext } from "../../hooks/AppContext";

export default function Analytics() {
  const { isDarkMode, loading, error, analyticsData } = useAppContext();
  const data = [
    {
      name: "Page A",
      uv: 100,
      pv: 100,
      amt: 300,
      cnt: 490,
    },
    {
      name: "Page B",
      uv: 121,
      pv: 121,
      amt: 121,
      cnt: 121,
    },
    {
      name: "Page C",
      uv: 112,
      pv: 118,
      amt: 122,
      cnt: 122,
    },
    {
      name: "Page D",
      uv: 121,
      pv: 122,
      amt: 121,
      cnt: 121,
    },
    {
      name: "Page E",
      uv: 1520,
      pv: 1108,
      amt: 1100,
      cnt: 460,
    },
    {
      name: "Page F",
      uv: 1400,
      pv: 680,
      amt: 1700,
      cnt: 380,
    },
  ];
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  // Theme colors
  const bgMain = isDarkMode ? "bg-gray-800" : "bg-gray-50";
  const bgCard = isDarkMode ? "bg-gray-700" : "bg-white";
  const textColor = isDarkMode ? "text-white" : "text-gray-800";
  const textSecondary = isDarkMode ? "text-gray-300" : "text-gray-500";
  const chartGridColor = isDarkMode ? "#4B5563" : "#E5E7EB";
  const chartTextColor = isDarkMode ? "#E5E7EB" : "#374151";

  return (
    <div className={`mt-4 sm:mt-6 p-4 sm:p-6 rounded-lg ${bgMain}`}>
      <h3
        className={`text-lg sm:text-xl font-semibold mb-4 sm:mb-6 ${textColor}`}
      >
        Analytics Overview
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className={`p-3 sm:p-4 rounded-lg ${bgCard} shadow-sm`}>
          <h4 className={`text-xs sm:text-sm ${textSecondary}`}>
            Active Users
          </h4>
          <p className={`text-xl sm:text-2xl font-bold ${textColor}`}>
            {analyticsData && analyticsData.activeUsers != null
              ? analyticsData.activeUsers.toLocaleString()
              : "1000k"}
          </p>
        </div>
        <div className={`p-3 sm:p-4 rounded-lg ${bgCard} shadow-sm`}>
          <h4 className={`text-xs sm:text-sm ${textSecondary}`}>
            Conversion Rate
          </h4>
          <p className={`text-xl sm:text-2xl font-bold ${textColor}`}>
            {analyticsData && analyticsData.conversionRate != null
              ? analyticsData.conversionRate
              : "23%"}
          </p>
        </div>
        <div className={`p-3 sm:p-4 rounded-lg ${bgCard} shadow-sm`}>
          <h4 className={`text-xs sm:text-sm ${textSecondary}`}>Revenue</h4>
          <p className={`text-xl sm:text-2xl font-bold ${textColor}`}>
            {analyticsData && analyticsData.revenue != null
              ? analyticsData.revenue.toLocaleString()
              : "$10000"}
          </p>
        </div>
      </div>
      {/* Chart */}
      <div className={`rounded-lg ${bgCard} shadow-sm p-3 sm:p-4`}>
        <div className="h-64 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={
                analyticsData && analyticsData.chartData != null
                  ? analyticsData.chartData
                  : data
              }
              margin={{
                top: 20,
                right: 20,
                bottom: 20,
                left: 20,
              }}
            >
              <CartesianGrid stroke={chartGridColor} strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                tick={{ fill: chartTextColor }}
                tickMargin={10}
              />
              <YAxis tick={{ fill: chartTextColor }} tickMargin={10} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDarkMode ? "#1F2937" : "#FFFFFF",
                  borderColor: isDarkMode ? "#4B5563" : "#E5E7EB",
                  borderRadius: "0.5rem",
                }}
                itemStyle={{ color: chartTextColor }}
              />
              <Legend
                wrapperStyle={{
                  paddingTop: "20px",
                  color: chartTextColor,
                }}
              />
              <Area
                type="monotone"
                dataKey="amt"
                fill={isDarkMode ? "#7C3AED" : "#8B5CF6"}
                stroke={isDarkMode ? "#7C3AED" : "#8B5CF6"}
                fillOpacity={0.4}
              />
              <Bar
                dataKey="pv"
                barSize={20}
                fill={isDarkMode ? "#10B981" : "#34D399"}
              />
              <Line
                type="monotone"
                dataKey="uv"
                stroke={isDarkMode ? "#F59E0B" : "#FBBF24"}
                strokeWidth={2}
              />
              <Scatter
                dataKey="cnt"
                fill={isDarkMode ? "#EF4444" : "#F87171"}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
