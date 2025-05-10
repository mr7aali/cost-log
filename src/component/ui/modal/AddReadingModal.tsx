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
  const [uId, setUId] = useState("");
  const [date, setDate] = useState({ day: "", month: "", year: "" });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    // Validation
    const parsedValue = parseFloat(value);
    const parsedUId = parseInt(uId);
    const parsedDay = parseInt(date.day);
    const parsedMonth = parseInt(date.month);
    const parsedYear = parseInt(date.year);

    if (isNaN(parsedValue) || parsedValue <= 0) {
      setError("Please enter a valid positive value.");
      setIsSubmitting(false);
      return;
    }
    if (isNaN(parsedUId) || parsedUId <= 0) {
      setError("Please enter a valid u_id.");
      setIsSubmitting(false);
      return;
    }
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

    try {
      const postData: IReading = {
        user_id: user._id,
        value: parsedValue,
        u_id: user.u_id,
        date: {
          day: parsedDay,
          month: parsedMonth,
          year: parsedYear,
        },
      };
      await addReadingModalRequest(postData);
      setValue("");
      setUId("");
      setDate({ day: "", month: "", year: "" });
      onClose();
    } catch {
      setError("Failed to add transaction. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-opacity-30 p-4 sm:p-6">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm sm:max-w-md md:max-w-lg p-5 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 text-center">
          Add Transaction for {user.name}
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
            <label
              htmlFor="uId"
              className="block text-sm font-medium text-gray-700"
            >
              U_ID
            </label>
            <input
              type="number"
              id="uId"
              value={uId}
              onChange={(e) => setUId(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm sm:text-base p-2"
              placeholder="Enter u_id"
              disabled={isSubmitting}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                value={date.day}
                onChange={(e) => setDate({ ...date, day: e.target.value })}
                className="mt-1 block w-1/3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm sm:text-base p-2"
                placeholder="Day"
                min="1"
                max="31"
                disabled={isSubmitting}
              />
              <input
                type="number"
                value={date.month}
                onChange={(e) => setDate({ ...date, month: e.target.value })}
                className="mt-1 block w-1/3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm sm:text-base p-2"
                placeholder="Month"
                min="1"
                max="12"
                disabled={isSubmitting}
              />
              <input
                type="number"
                value={date.year}
                onChange={(e) => setDate({ ...date, year: e.target.value })}
                className="mt-1 block w-1/3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm sm:text-base p-2"
                placeholder="Year"
                min="2000"
                max="2100"
                disabled={isSubmitting}
              />
            </div>
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
              {isSubmitting ? "Adding..." : "Add Transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddReadingModal;
