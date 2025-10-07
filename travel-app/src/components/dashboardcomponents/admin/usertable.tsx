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
import { Edit, Trash2, Search } from 'lucide-react';

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  image?: string;
  createdAt: string;
};

export default function UserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [filtered, setFiltered] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState<null | User>(null);
  const [deleteModal, setDeleteModal] = useState<null | User>(null);
  const [newRole, setNewRole] = useState('');
  const [search, setSearch] = useState('');

  const t = useTranslations('admin');

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const usersRes = await axios.get('/api/user');
        setUsers(usersRes.data.instanceFiltered);
        setFiltered(usersRes.data.instanceFiltered);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  // 🔍 Search users
  useEffect(() => {
    const result = users.filter(
      (u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [search, users]);

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

  if (loading)
    return (
      <div className="text-center py-12 text-gray-500 animate-pulse">
      loading
      </div>
    );

  return (
    <>
      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-6 relative">
        <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
        <Input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder='search by name or email...'
          className="pl-10 pr-4 py-2 w-full rounded-xl border-gray-300 shadow-md focus:ring-2 focus:ring-emerald-400 transition-all duration-200"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800">
        <table className="min-w-full">
          <thead className="bg-gradient-to-r from-emerald-500 to-green-600 text-white uppercase text-sm tracking-wide rounded-t-xl">
            <tr>
              <th className="py-3 px-6 text-left rounded-tl-xl">{t('userTable.headers.profile')}</th>
              <th className="py-3 px-6 text-left">{t('userTable.headers.email')}</th>
              <th className="py-3 px-6 text-left">{t('userTable.headers.role')}</th>
              <th className="py-3 px-6 text-left">{t('userTable.headers.joined')}</th>
              <th className="py-3 px-6 text-center rounded-tr-xl">{t('userTable.headers.actions')}</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 dark:text-gray-300 text-sm divide-y divide-gray-200 dark:divide-gray-700">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-500 italic">
                  user not found
                </td>
              </tr>
            ) : (
              filtered.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
                >
                  <td className="py-3 px-6 flex items-center gap-3">
                    <img
                      src={user.image ? `/userimages/${user.image}` : '/pro.png'}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover border shadow-sm"
                    />
                    <span className="font-semibold">{user.name}</span>
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
                        className="text-blue-600 border-blue-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
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
                        className="text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                        onClick={() => setDeleteModal(user)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        {t('userTable.buttons.delete')}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      <Dialog open={!!editModal} onOpenChange={(open) => !open && setEditModal(null)}>
        <DialogContent className="rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-emerald-600">
              {t('userTable.editModal.title')}
            </DialogTitle>
            <DialogDescription>
              {t('userTable.editModal.description')} {editModal?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
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
            <Button
              onClick={handleUpdateRole}
              className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white"
            >
              {t('userTable.buttons.update')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={!!deleteModal} onOpenChange={(open) => !open && setDeleteModal(null)}>
        <DialogContent className="rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-red-600">
              {t('userTable.deleteModal.title')}
            </DialogTitle>
            <DialogDescription>
              {t('userTable.deleteModal.description')} <strong>{deleteModal?.name}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteModal(null)}>
              {t('userTable.buttons.cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteUser}
              className="hover:bg-red-700 transition-all duration-200"
            >
              {t('userTable.buttons.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
