'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
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

  const t = useTranslations('admin');

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
              <th className="py-3 px-6 text-left">{t('userTable.headers.profile')}</th>
              <th className="py-3 px-6 text-left">{t('userTable.headers.email')}</th>
              <th className="py-3 px-6 text-left">{t('userTable.headers.role')}</th>
              <th className="py-3 px-6 text-left">{t('userTable.headers.joined')}</th>
              <th className="py-3 px-6 text-center">{t('userTable.headers.actions')}</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50 transition">
                <td className="py-3 px-6 flex items-center gap-3">
                  <img
                    src={`/userimages/${user.image}` || '/pro.png'}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover border"
                  />
                  <span>{user.name}</span>
                </td>
                <td className="py-3 px-6">{user.email}</td>
                <td className="py-3 px-6 capitalize">{user.role}</td>
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
                      {t('userTable.buttons.edit')}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-200"
                      onClick={() => setDeleteModal(user)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      {t('userTable.buttons.delete')}
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
            <DialogTitle>{t('userTable.editModal.title')}</DialogTitle>
            <DialogDescription>
              {t('userTable.editModal.description')} {editModal?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Label>{t('userTable.editModal.email')}</Label>
            <Input value={editModal?.email ?? ''} readOnly />

            <Label>{t('userTable.editModal.newRole')}</Label>
            <Select value={newRole} onValueChange={setNewRole}>
              <SelectTrigger>
                <SelectValue placeholder={t('userTable.editModal.selectRole')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">{t('userTable.editModal.roles.admin')}</SelectItem>
                <SelectItem value="user">{t('userTable.editModal.roles.user')}</SelectItem>
                <SelectItem value="guide">{t('userTable.editModal.roles.guide')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditModal(null)}>
              {t('userTable.buttons.cancel')}
            </Button>
            <Button onClick={handleUpdateRole}>{t('userTable.buttons.update')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={!!deleteModal} onOpenChange={(open) => !open && setDeleteModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('userTable.deleteModal.title')}</DialogTitle>
            <DialogDescription>
              {t('userTable.deleteModal.description')} <strong>{deleteModal?.name}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteModal(null)}>
              {t('userTable.buttons.cancel')}
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              {t('userTable.buttons.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
