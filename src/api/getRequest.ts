"use server";
import { IReading } from "@/interface/reading";
import { IUser } from "@/interface/user";
import { revalidateTag } from "next/cache";
export const getUsersInfo = async (): Promise<IUser[]> => {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/user`;
  const response = await fetch(url, {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch user data");
  }
  return (await response.json()) as IUser[];
};

export const getReading = async (): Promise<IUser[]> => {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/readings/get`;
  const response = await fetch(url, {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch user data");
  }
  revalidateTag("reading");
  return (await response.json()) as IUser[];
};

export const getReadingByUserID = async (
  userId: string
): Promise<{
  userInfo: IUser;
  readings: IReading[];
}> => {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/readings/get/${userId}`;
  const response = await fetch(url, {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch user data");
  }
  revalidateTag("reading");
  return (await response.json()) as {
    userInfo: IUser;
    readings: IReading[];
  };
};
