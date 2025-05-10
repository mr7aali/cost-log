"use client";

import { FC, useState, FormEvent } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: { _id: string; name: string; balance: number };
  // onUpdate: (userId: string, newBalance: number) => void;
}

const AddMoneyModal: FC<ModalProps> = ({ isOpen, onClose, user }) => {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/user/${user._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ balance: user.balance + parsedAmount }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update balance");
      }

      // onUpdate(user._id, user.balance + parsedAmount);
      setAmount("");
      onClose();
    } catch {
      setError("Failed to update balance. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-xs bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Add Money for {user.name}
        </h2>
        <form onSubmit={handleSubmit}>
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter amount"
              step="0.01"
              disabled={isSubmitting}
            />
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
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
