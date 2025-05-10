import React from "react";
// import AddMoneyButton from "../ui/button/AddMoneyButton";
import { IUser } from "@/interface/user";
// import AddReadingButton from "../ui/button/AddReadingButton";

const ReadingInformation = ({ data }: { data: IUser[] }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="w-full overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 text-xs sm:text-sm text-gray-500 uppercase tracking-wider">
            <tr className="text-center">
              {data.map((Item) => (
                <th
                  key={Item._id}
                  className="px-4 py-2 sm:px-6 sm:py-3 cursor-pointer"
                >
                  {Item.name}
                </th>
              ))}
              {/* <th className="px-4 py-2 sm:px-6 sm:py-3">Add Balance</th>
              <th className="px-4 py-2 sm:px-6 sm:py-3">add Reading</th> */}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 text-sm text-center">
            {data.map((item) => (
              <tr
                key={item._id}
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="px-4 py-3 sm:px-6 whitespace-nowrap font-medium text-gray-900">
                  {item.name}
                </td>
                <td className="px-4 py-3 sm:px-6 whitespace-nowrap text-gray-500">
                  {item.u_id}
                </td>
                <td className="px-4 py-3 sm:px-6 whitespace-nowrap text-gray-500">
                  {item.balance.toFixed(2)} TK
                </td>
                {/* <td className="px-4 py-3 sm:px-6 whitespace-nowrap text-gray-500">
                  <AddMoneyButton data={item} buttonText="Edit" />
                </td>
                <td className="px-4 py-3 sm:px-6 whitespace-nowrap text-gray-500">
                  <AddReadingButton data={item} buttonText="Edit" />
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReadingInformation;
