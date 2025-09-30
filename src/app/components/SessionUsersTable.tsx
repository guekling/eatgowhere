import { UserRestaurantAttributes } from "../lib/interfaces";
import { UserRoles } from "../lib/types";

interface SessionUsersTableProps {
  users?: Record<string, UserRestaurantAttributes>;
}

export default function SessionUsersTable({ users }: SessionUsersTableProps) {
  const userList = Object.values(users || {});

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Restaurant</th>
          </tr>
        </thead>
        <tbody>
          {userList.map((user) => (
            <tr key={user.id}>
              {user.role === UserRoles.INITIATOR ? (
                <td>
                  <strong>{user.username}</strong>
                </td>
              ) : (
                <td>{user.username}</td>
              )}
              <td>{user.restaurant || "No Restaurant Selected"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
