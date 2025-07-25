'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Edit, Trash2 } from 'lucide-react';

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  image: string;
  createdAt: string;
};

export default function UserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState<null | User>(null);
  const [deleteModal, setDeleteModal] = useState<null | User>(null);
  const [newRole, setNewRole] = useState('');

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const usersRes = await axios.get('/api/user');
        setUsers(usersRes.data.instanceFiltered);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const handleUpdateRole = async () => {
    if (!editModal) return;
    try {
      await axios.patch(`/api/user/${encodeURIComponent(editModal.email)}`, { role: newRole });
      setUsers((prev) =>
        prev.map((u) => (u.email === editModal.email ? { ...u, role: newRole } : u))
      );
      setEditModal(null);
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteModal) return;
    try {
      await axios.delete(`/api/user/${encodeURIComponent(deleteModal.email)}`);
      setUsers((prev) => prev.filter((u) => u.email !== deleteModal.email));
      setDeleteModal(null);
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <>
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
              <tr key={user._id} className="hover:bg-gray-50 transition">
                <td className="py-3 px-6">{user.name}</td>
                <td className="py-3 px-6">{user.email}</td>
                <td className="py-3 px-6">{user.role}</td>
                <td className="py-3 px-6">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3 px-6 text-center">
                  <div className="flex gap-2 justify-center">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-blue-600 border-blue-200"
                      onClick={() => {
                        setEditModal(user);
                        setNewRole(user.role);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-200"
                      onClick={() => setDeleteModal(user)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      <Dialog open={!!editModal} onOpenChange={(open) => !open && setEditModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User Role</DialogTitle>
            <DialogDescription>Update the role for {editModal?.name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Label>Email</Label>
            <Input value={editModal?.email ?? ""} readOnly />

            <Label>New Role</Label>
            <Select value={newRole} onValueChange={setNewRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="User">User</SelectItem>
                <SelectItem value="Editor">Editor</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditModal(null)}>Cancel</Button>
            <Button onClick={handleUpdateRole}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={!!deleteModal} onOpenChange={(open) => !open && setDeleteModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete user <strong>{deleteModal?.name}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteModal(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteUser}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
