"use client";

import { useState } from "react";
import { IUser } from "@/interface/user";
import AddMoneyModal from "../modal/AddMoneyModal";

const AddMoneyButton = ({
  data,
  buttonText,
}: // onUpdate,
{
  data?: IUser;
  buttonText: string;
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
      <AddMoneyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={{ _id: data._id, name: data.name, balance: data.balance }}
      />
    </>
  );
};

export default AddMoneyButton;
