import { UserRestaurantAttributes } from "../lib/interfaces";
import { UserRoles } from "../lib/types";

interface SessionUsersTableProps {
  users?: Record<string, UserRestaurantAttributes>;
  chosenRestaurant?: string;
}

export default function SessionUsersTable({
  users,
  chosenRestaurant,
}: SessionUsersTableProps) {
  const userList = Object.values(users || {});

  return (
    <div className="w-full mb-6 overflow-hidden rounded-lg shadow-sm border border-gray-200">
      <table className="w-full">
        <thead>
          <tr className="bg-blue-600 text-white">
            <th className="px-6 py-3 text-sm font-semibold uppercase tracking-wider">
              User
            </th>
            <th className="px-6 py-3 text-sm font-semibold uppercase tracking-wider">
              Restaurant
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {userList.map((user) => {
            const isChosenRestaurant =
              chosenRestaurant && user.restaurant === chosenRestaurant;
            const rowClasses = isChosenRestaurant
              ? "bg-green-100 border-l-4 border-l-green-500"
              : "hover:bg-gray-50";

            return (
              <tr key={user.id} className={rowClasses}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {/* user logic: (a) if user is initiator, add HOST badge */}
                    {user.role === UserRoles.INITIATOR ? (
                      <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          HOST
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                          {user.username}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-900">
                        {user.username}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {/* restaurant logic: (a) if user has a restaurant, display; (b) if restaurant is chosen, add tick */}
                    {user.restaurant ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-900">
                          {user.restaurant}
                        </span>
                        {isChosenRestaurant && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-300 text-green-800">
                            ✓ Chosen
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500 italic">
                        No Restaurant Selected
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
