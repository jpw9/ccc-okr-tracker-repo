
import React from 'react';
import { Plus } from 'lucide-react';
import { User, Role } from '../../../types';
import './UserManagement.css';

interface Props {
    users: User[];
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
    theme: any;
    onSave: (e: any) => void;
    onDelete: (id: string | number) => void;
    onEdit: (user: User) => void;
    onAdd: () => void;
    isEditing: boolean;
    setIsEditing: (val: boolean) => void;
    currentUser: User | null;
}

export const UserManagementView: React.FC<Props> = ({ users, theme, onSave, onDelete, onEdit, onAdd, isEditing, setIsEditing, currentUser }) => {
    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
                <button onClick={onAdd} className={`${theme.primary} text-white px-4 py-2 rounded-lg ${theme.hover} flex items-center transition-colors`}>
                    <Plus size={18} className="mr-2"/> Add User
                </button>
            </div>

            {isEditing && (
                <div className="bg-white p-6 rounded-lg shadow border border-gray-200 mb-6">
                    <h3 className="text-lg font-semibold mb-4">{currentUser ? 'Edit User' : 'Create New User'}</h3>
                    <form onSubmit={onSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium text-gray-700">Full Name</label><input required name="name" defaultValue={currentUser?.name} className="mt-1 block w-full border border-gray-300 rounded-md p-2"/></div>
                        <div><label className="block text-sm font-medium text-gray-700">Email</label><input required type="email" name="email" defaultValue={currentUser?.email} className="mt-1 block w-full border border-gray-300 rounded-md p-2"/></div>
                        <div><label className="block text-sm font-medium text-gray-700">Department</label><input name="department" defaultValue={currentUser?.department} className="mt-1 block w-full border border-gray-300 rounded-md p-2"/></div>
                        <div><label className="block text-sm font-medium text-gray-700">Role</label><select name="role" defaultValue={currentUser?.role || Role.CONTRIBUTOR} className="mt-1 block w-full border border-gray-300 rounded-md p-2">{Object.values(Role).map(r => <option key={r} value={r}>{r}</option>)}</select></div>
                        <div className="md:col-span-2 flex justify-end space-x-3 mt-4"><button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button><button type="submit" className={`px-4 py-2 ${theme.primary} text-white rounded ${theme.hover}`}>Save User</button></div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 user-table">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">User</th>
                            <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Department</th>
                            <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Role</th>
                            <th className="px-6 py-3 text-right text-xs text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map(user => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4"><div className="flex items-center"><div className={`h-10 w-10 rounded-full ${theme.lightBg} ${theme.text} flex items-center justify-center font-bold text-sm`}>{user.avatar || 'US'}</div><div className="ml-4"><div className="text-sm font-medium text-gray-900">{user.name}</div><div className="text-sm text-gray-500">{user.email}</div></div></div></td>
                                <td className="px-6 py-4 text-sm text-gray-500">{user.department || '-'}</td>
                                <td className="px-6 py-4"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === Role.ADMIN ? 'bg-purple-100 text-purple-800' : user.role === Role.MANAGER ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{user.role}</span></td>
                                <td className="px-6 py-4 text-right text-sm font-medium space-x-3"><button onClick={() => onEdit(user)} className={`${theme.text} hover:underline`}>Edit</button><button onClick={() => onDelete(user.id)} className="text-red-600 hover:text-red-900">Delete</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
