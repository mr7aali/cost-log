"use client";

import { useState } from "react";
import { IUser } from "@/interface/user";
// import AddMoneyModal from "../modal/AddMoneyModal";
import AddReadingModal from "../modal/AddReadingModal";

const AddReadingButton = ({
  data,
  buttonText,
}: // onUpdate,
{
  data?: IUser;
  buttonText: string;
  // onUpdate: (userId: string, newBalance: number) => void;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!data) return null;

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="inline-flex cursor-pointer items-center px-5 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {buttonText || "Action"}
      </button>
      <AddReadingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={{ _id: data._id, name: data.name, u_id: data.u_id }}
      />
    </>
  );
};

export default AddReadingButton;
