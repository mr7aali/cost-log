"use client";

import { addReadingModalRequest } from "@/api/postRequest";
import { IReading } from "@/interface/reading";
import { FC, useState, FormEvent } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: { _id: string; name: string; u_id: number };
}

const AddReadingModal: FC<ModalProps> = ({ isOpen, onClose, user }) => {
  const [value, setValue] = useState("");
  const [date, setDate] = useState({ day: "", month: "", year: "" });
  const [useDatePicker, setUseDatePicker] = useState(false);
  const [datePickerValue, setDatePickerValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<
    "day" | "month" | "year" | null
  >(null);

  // Generate options for dropdowns
  const dayOptions = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
  const monthOptions = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  const yearOptions = Array.from({ length: 26 }, (_, i) =>
    (2021 + i).toString()
  ); // 2000 to 2025

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    // Validation for value
    const parsedValue = parseFloat(value);
    if (isNaN(parsedValue) || parsedValue <= 0) {
      setError("Please enter a valid positive value.");
      setIsSubmitting(false);
      return;
    }

    // Date validation
    let parsedDay: number, parsedMonth: number, parsedYear: number;
    if (useDatePicker) {
      if (!datePickerValue) {
        setError("Please select a valid date.");
        setIsSubmitting(false);
        return;
      }
      const dateObj = new Date(datePickerValue);
      parsedDay = dateObj.getDate();
      parsedMonth = dateObj.getMonth() + 1; // Months are 0-based in JS
      parsedYear = dateObj.getFullYear();
    } else {
      parsedDay = parseInt(date.day);
      parsedMonth = parseInt(date.month);
      parsedYear = parseInt(date.year);
      if (
        isNaN(parsedDay) ||
        parsedDay < 1 ||
        parsedDay > 31 ||
        isNaN(parsedMonth) ||
        parsedMonth < 1 ||
        parsedMonth > 12 ||
        isNaN(parsedYear) ||
        parsedYear < 2000 ||
        parsedYear > 2100
      ) {
        setError("Please enter a valid date.");
        setIsSubmitting(false);
        return;
      }
    }

    try {
      const postData: Partial<IReading> = {
        user_id: user._id,
        value: parsedValue,
        u_id: user.u_id,
        date: {
          day: parsedDay,
          month: parsedMonth,
          year: parsedYear,
        },
      };
      await addReadingModalRequest(postData as IReading);

      setValue("");
      setDate({ day: "", month: "", year: "" });
      setDatePickerValue("");
      setActiveDropdown(null);
      onClose();
    } catch {
      setError("Failed to add transaction. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle date picker change
  const handleDatePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDatePickerValue(e.target.value);
  };

  // Toggle between manual and date picker
  const toggleDateInput = () => {
    setUseDatePicker(!useDatePicker);
    setError(null);
    setDate({ day: "", month: "", year: "" });
    setDatePickerValue("");
    setActiveDropdown(null);
  };

  // Handle dropdown selection
  const handleDropdownSelect = (
    field: "day" | "month" | "year",
    value: string
  ) => {
    setDate({ ...date, [field]: value });
    setActiveDropdown(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-opacity-30 p-4 sm:p-6">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm sm:max-w-md md:max-w-lg p-5 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 text-center">
          Add Reading for {user.name}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="value"
              className="block text-sm font-medium text-gray-700"
            >
              Value (TK)
            </label>
            <input
              type="number"
              id="value"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm sm:text-base p-2"
              placeholder="Enter value"
              step="0.01"
              disabled={isSubmitting}
            />
          </div>
          <div className="mb-4">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <button
                type="button"
                onClick={toggleDateInput}
                className="text-sm text-indigo-600 hover:text-indigo-800"
                disabled={isSubmitting}
              >
                {useDatePicker ? "Use Manual Entry" : "Use Date Picker"}
              </button>
            </div>
            {useDatePicker ? (
              <input
                type="date"
                value={datePickerValue}
                onChange={handleDatePickerChange}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm sm:text-base p-2"
                disabled={isSubmitting}
                min="2000-01-01"
                max="2100-12-31"
              />
            ) : (
              <div className="flex space-x-2 mt-1 relative">
                <div className="w-1/3 relative">
                  <input
                    type="text"
                    value={date.day}
                    onFocus={() => setActiveDropdown("day")}
                    onChange={(e) => setDate({ ...date, day: e.target.value })}
                    className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm sm:text-base p-2"
                    placeholder="Day"
                    disabled={isSubmitting}
                  />
                  {activeDropdown === "day" && (
                    <select
                      size={5}
                      className="absolute top-full left-0 w-full rounded-md border border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm p-1 z-10"
                      onChange={(e) =>
                        handleDropdownSelect("day", e.target.value)
                      }
                      autoFocus
                    >
                      {dayOptions.map((day) => (
                        <option key={day} value={day}>
                          {day}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                <div className="w-1/3 relative">
                  <input
                    type="text"
                    value={date.month}
                    onFocus={() => setActiveDropdown("month")}
                    onChange={(e) =>
                      setDate({ ...date, month: e.target.value })
                    }
                    className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm sm:text-base p-2"
                    placeholder="Month"
                    disabled={isSubmitting}
                  />
                  {activeDropdown === "month" && (
                    <select
                      size={5}
                      className="absolute top-full left-0 w-full rounded-md border border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm p-1 z-10"
                      onChange={(e) =>
                        handleDropdownSelect("month", e.target.value)
                      }
                      autoFocus
                    >
                      {monthOptions.map((month) => (
                        <option key={month} value={month}>
                          {month}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                <div className="w-1/3 relative">
                  <input
                    type="text"
                    value={date.year}
                    onFocus={() => setActiveDropdown("year")}
                    onChange={(e) => setDate({ ...date, year: e.target.value })}
                    className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm sm:text-base p-2"
                    placeholder="Year"
                    disabled={isSubmitting}
                  />
                  {activeDropdown === "year" && (
                    <select
                      size={5}
                      className="absolute top-full left-0 w-full rounded-md border border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm p-1 z-10"
                      onChange={(e) =>
                        handleDropdownSelect("year", e.target.value)
                      }
                      autoFocus
                    >
                      {yearOptions.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            )}
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-end sm:space-x-3 gap-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add Reading"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddReadingModal;
