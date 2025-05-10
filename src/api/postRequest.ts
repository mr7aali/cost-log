"use server";

import { IReading } from "@/interface/reading";
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
  // revalidateTag("user-balance");
};
