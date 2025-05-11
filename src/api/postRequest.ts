"use server";

import { IReading } from "@/interface/reading";
import { IPaymentAddResquestBody } from "@/interface/request";
import { revalidateTag } from "next/cache";

export const addMoneyRequest = async (data: { id: string; amount: number }) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/user/add_balance`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch user data");
  }
  revalidateTag("user-balance");
};
export const addReadingModalRequest = async (data: IReading) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/readings/create`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch user data");
  }

  // revalidateTag("user-balance");
};

// r_id: rId,
// user_id: user._id,
// amount: amount,
// u_id: user.u_id,
export const createPayment = async (data: IPaymentAddResquestBody) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/payment/create`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }
  );

  console.log(response);
  if (!response.ok) {
    throw new Error("Failed to fetch user data");
  }
  //
  revalidateTag("user-balance");
};
