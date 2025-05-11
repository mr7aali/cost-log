"use client";

import React, { useState, useCallback, useEffect } from "react";
import { IUser } from "@/interface/user";
import { motion, AnimatePresence } from "framer-motion";
import { getReadingByUserID } from "@/api/getRequest";
import { IReading } from "@/interface/reading";

// interface IReading {
//   _id: string;
//   r_id: number;
//   user_id: string;
//   value: number;
//   u_id: number;
//   unit: number;
//   date: { day: number; month: number; year: number };
//   createdAt: string;
//   updatedAt: string;
//   prepaidAmmount: number;
//   __v: number;
// }

// interface APIResponse {
//   userInfo: IUser;
//   readings: IReading[];
// }

const ReadingInformation = ({ data }: { data: IUser[] }) => {
  const [readings, setReadings] = useState<{ [key: string]: IReading[] }>({});
  const [activeUsers, setActiveUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [error, setError] = useState<string | null>(null);

  // Fetch readings for a single user
  const fetchReadings = useCallback(
    async (userId: string) => {
      if (!userId) {
        console.error("Invalid userId:", userId);
        setError("Invalid user ID.");
        return;
      }

      if (readings[userId]) {
        // Toggle visibility if data is already fetched
        setActiveUsers((prev) =>
          prev.includes(userId)
            ? prev.filter((id) => id !== userId)
            : [...prev, userId]
        );
        return;
      }

      setLoading((prev) => ({ ...prev, [userId]: true }));
      setError(null);

      try {
        // const response = await fetch(
        //   `http://localhost:5000/readings/get/${userId}`
        // );
        const result = await getReadingByUserID(userId);
        // if (!response.ok) {
        //   throw new Error(`Failed to fetch readings: ${response.status}`);
        // }
        // const result: APIResponse = await response.json();
        // Sort readings by date
        const sortedReadings = result.readings.sort((a, b) => {
          const dateA = new Date(a.date.year, a.date.month - 1, a.date.day);
          const dateB = new Date(b.date.year, b.date.month - 1, b.date.day);
          return dateA.getTime() - dateB.getTime();
        });
        setReadings((prev) => ({ ...prev, [userId]: sortedReadings }));
        setActiveUsers((prev) => [...prev, userId]);
      } catch (err) {
        console.error(`Error fetching readings for user ${userId}:`, err);
        setError(
          `Failed to load readings for ${
            data.find((u) => u._id === userId)?.name || "user"
          }.`
        );
      } finally {
        setLoading((prev) => ({ ...prev, [userId]: false }));
      }
    },
    [readings, data]
  );

  // Auto-fetch readings for all users on mount
  useEffect(() => {
    const fetchAllReadings = async () => {
      for (const user of data) {
        if (!readings[user._id]) {
          await fetchReadings(user._id);
        }
      }
    };

    fetchAllReadings();
  }, [data, fetchReadings, readings]);

  // Collect all unique dates and sort them chronologically
  const uniqueDates = Array.from(
    new Set(
      activeUsers
        .flatMap((userId) =>
          readings[userId]?.map(
            (reading) =>
              `${reading.date.year}-${reading.date.month
                .toString()
                .padStart(2, "0")}-${reading.date.day
                .toString()
                .padStart(2, "0")}`
          )
        )
        .filter(Boolean)
    )
  )
    .sort()
    .map((dateStr) => {
      const [year, month, day] = dateStr.split("-").map(Number);
      return { day, month, year };
    });

  // Format date as DD/MM/YYYY
  const formatDate = (date: { day: number; month: number; year: number }) => {
    return `${date.day.toString().padStart(2, "0")}/${date.month
      .toString()
      .padStart(2, "0")}/${date.year}`;
  };

  // Calculate units and get aggregated data for a specific date
  const getDataForDate = (
    userReadings: IReading[],
    date: { day: number; month: number; year: number }
  ) => {
    const matchingReadings = userReadings.filter(
      (r) =>
        r.date.day === date.day &&
        r.date.month === date.month &&
        r.date.year === date.year
    );
    if (!matchingReadings.length) return { display: "-", unit: 0 };

    // Calculate units as difference from previous reading
    const sortedReadings = [...userReadings].sort((a, b) => {
      const dateA = new Date(a.date.year, a.date.month - 1, a.date.day);
      const dateB = new Date(b.date.year, b.date.month - 1, b.date.day);
      return dateA.getTime() - dateB.getTime();
    });

    let totalValue = 0;
    let totalUnit = 0;
    let totalPrepaid = 0;

    matchingReadings.forEach((reading) => {
      const readingIndex = sortedReadings.findIndex(
        (r) => r._id === reading._id
      );
      let calculatedUnit = 0;
      if (readingIndex > 0) {
        calculatedUnit = reading.value - sortedReadings[readingIndex - 1].value;
      } // First reading: unit = 0
      totalValue += reading.value;
      totalUnit += calculatedUnit;
      totalPrepaid += reading.prepaidAmmount;
    });

    return {
      display: `${totalValue.toFixed(2)} TK / ${totalUnit.toFixed(
        0
      )} units / ${totalPrepaid.toFixed(2)} TK`,
      unit: totalUnit,
    };
  };

  // Calculate total units for a specific date across all users
  const getTotalUnitsForDate = (date: {
    day: number;
    month: number;
    year: number;
  }) => {
    let totalUnits = 0;
    let hasData = false;

    activeUsers.forEach((userId) => {
      const data = getDataForDate(readings[userId], date);
      if (data.unit !== 0) {
        totalUnits += data.unit;
        hasData = true;
      }
    });

    return hasData ? `${totalUnits.toFixed(0)} units` : "-";
  };

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="w-full overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 text-xs sm:text-sm text-gray-500 uppercase tracking-wider">
            <tr className="text-center">
              <th className="px-4 py-2 sm:px-6 sm:py-3 sticky left-0 bg-gray-50 font-semibold">
                Date
              </th>
              {data.map((item) => (
                <th
                  key={item._id}
                  className="px-4 py-2 sm:px-6 sm:py-3 cursor-pointer hover:bg-gray-100 transition-colors duration-150"
                  onClick={() => fetchReadings(item._id)}
                >
                  <div className="flex items-center justify-center">
                    {item.name}
                    {loading[item._id] && (
                      <motion.svg
                        className="animate-spin h-4 w-4 ml-2 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </motion.svg>
                    )}
                  </div>
                </th>
              ))}
              <th className="px-4 py-2 sm:px-6 sm:py-3 font-semibold">
                Total Units
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 text-sm text-center">
            <AnimatePresence>
              {uniqueDates.map((date, rowIndex) => (
                <motion.tr
                  key={`${date.year}-${date.month}-${date.day}`}
                  className="hover:bg-gray-50 transition-colors duration-200"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <td className="px-4 py-3 sm:px-6 whitespace-nowrap font-medium text-gray-900 sticky left-0 bg-white">
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {formatDate(date)}
                    </motion.span>
                  </td>
                  {data.map((item) => (
                    <td
                      key={`${item._id}-data-${rowIndex}`}
                      className="px-4 py-3 sm:px-6 whitespace-nowrap text-gray-500"
                    >
                      {activeUsers.includes(item._id) &&
                      readings[item._id]?.length ? (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          {getDataForDate(readings[item._id], date).display}
                        </motion.span>
                      ) : (
                        "-"
                      )}
                    </td>
                  ))}
                  <td className="px-4 py-3 sm:px-6 whitespace-nowrap text-gray-900 font-medium">
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {getTotalUnitsForDate(date)}
                    </motion.span>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
      {error && (
        <motion.div
          className="p-4 text-center text-sm text-red-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {error}
        </motion.div>
      )}
    </div>
  );
};

export default ReadingInformation;
