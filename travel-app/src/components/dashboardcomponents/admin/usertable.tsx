'use client';

import UserActions from './useraction';

const users = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', joined: '2024-05-10' },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', role: 'User', joined: '2024-04-15' },
  { id: '3', name: 'Charlie Kim', email: 'charlie@example.com', role: 'Editor', joined: '2024-03-20' },
];

export default function UserTable() {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border rounded-lg shadow-sm">
        <thead className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
          <tr>
            <th className="py-3 px-6 text-left">Name</th>
            <th className="py-3 px-6 text-left">Email</th>
            <th className="py-3 px-6 text-left">Role</th>
            <th className="py-3 px-6 text-left">Joined</th>
            <th className="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-700 text-sm divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50 transition">
              <td className="py-3 px-6">{user.name}</td>
              <td className="py-3 px-6">{user.email}</td>
              <td className="py-3 px-6">{user.role}</td>
              <td className="py-3 px-6">{user.joined}</td>
              <td className="py-3 px-6 text-center">
                <UserActions />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
