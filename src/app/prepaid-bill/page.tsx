import AddMoneyButton from "@/component/ui/button/AddMoneyButton";
import { IUser } from "@/interface/user";
import { FC } from "react";

const PrepaidBillPage: FC = async () => {
  let userData: IUser[] = [];
  let error: string | null = null;

  try {
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/user`;
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }
    userData = (await response.json()) as IUser[];
  } catch {
    error =
      "An error occurred while fetching user data. Please try again later.";
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
          User Information
        </h1>

        {error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center">
            {error}
          </div>
        ) : userData.length === 0 ? (
          <div className="bg-white shadow-lg rounded-lg p-6 text-center">
            <p className="text-gray-500">No user data available.</p>
          </div>
        ) : (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 text-center">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3  text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3  text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      User ID
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3  text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Balance
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3  text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 text-center">
                  {userData.map((item) => (
                    <tr
                      key={item._id}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.u_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.balance.toFixed(2)} TK
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <AddMoneyButton
                          data={item}
                          buttonText="Edit"
                          // onUpdate={handleUpdate}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrepaidBillPage;
