import { getUsersInfo } from "@/api/getRequest";
import UserInfoTable from "@/component/prepaid-bill-page/UserInfoTable";
import { IUser } from "@/interface/user";
import { FC } from "react";

const PrepaidBillPage: FC = async () => {
  let userData: IUser[] = [];
  let error: string | null = null;

  try {
    userData = await getUsersInfo();
  } catch {
    error =
      "An error occurred while fetching user data. Please try again later.";
  }
  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-6 text-center">
          User Information
        </h1>

        {error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center text-sm sm:text-base">
            {error}
          </div>
        ) : userData.length === 0 ? (
          <div className="bg-white shadow-lg rounded-lg p-6 text-center">
            <p className="text-gray-500 text-sm sm:text-base">
              No user data available.
            </p>
          </div>
        ) : (
          <UserInfoTable data={userData} />
        )}
      </div>
    </div>
  );
};

export default PrepaidBillPage;
