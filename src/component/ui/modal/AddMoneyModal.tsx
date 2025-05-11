"use client";

import { getReading } from "@/api/getRequest";
// import { addMoneyRequest } from "@/api/postRequest";
import { FC, useState, FormEvent, useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: { _id: string; name: string; balance: number; u_id: number };
}

const AddMoneyModal: FC<ModalProps> = ({ isOpen, onClose, user }) => {
  const [amount, setAmount] = useState("");
  const [rId, setRId] = useState("1"); // Default r_id value
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sample r_id options; replace with your actual options if needed

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getReading();
        console.log(result);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);
  const rIdOptions = [
    { value: "1", label: "Option 1" },
    { value: "2", label: "Option 2" },
    { value: "3", label: "Option 3" },
  ];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Please enter a valid positive amount.");
      setIsSubmitting(false);
      return;
    }

    try {
      const respostData = {
        r_id: rId,
        user_id: user._id,
        amount: amount,
        u_id: user.u_id,
      };
      console.log(respostData);
      // {
      //   "r_id":1,
      //   "user_id":"681e4b1ffbf94af791315feb",
      //   "ammount":1000,
      //   "u_id":1
      // }
      // await addMoneyRequest({
      //   amount: Number(respostData.amount),
      //   id: respostData.id,
      //   r_id: Number(respostData.r_id),
      // });
      setAmount("");
      setRId("1"); // Reset to default
      onClose();
    } catch {
      setError("Failed to update balance. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-opacity-30 p-4 sm:p-6">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm sm:max-w-md md:max-w-lg p-5 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 text-center">
          Add Money for {user.name}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="r_id"
              className="block text-sm font-medium text-gray-700"
            >
              Request ID
            </label>
            <select
              id="r_id"
              value={rId}
              onChange={(e) => setRId(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm sm:text-base p-2"
              disabled={isSubmitting}
            >
              {rIdOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700"
            >
              Amount (TK)
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm sm:text-base p-2"
              placeholder="Enter amount"
              step="0.01"
              disabled={isSubmitting}
            />
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
              {isSubmitting ? "Adding..." : "Add Money"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMoneyModal;
