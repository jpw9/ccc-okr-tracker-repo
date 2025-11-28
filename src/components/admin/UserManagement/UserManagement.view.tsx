import React from 'react';
import { Plus, ToggleRight, ToggleLeft, User as UserIcon, Clock } from 'lucide-react';
import { User, Role } from '../../../types';
import './UserManagement.css';

interface Props {
    users: User[];
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
    theme: any;
    onSave: (e: any) => void;
    onDelete: (user: User) => void; // Now takes the user object for soft delete
    onEdit: (user: User) => void;
    onAdd: () => void;
    isEditing: boolean;
    setIsEditing: (val: boolean) => void;
    currentUser: User | null;
    projectMap: Record<string | number, string>; // New prop
}

export const UserManagementView: React.FC<Props> = ({ users, theme, onSave, onDelete, onEdit, onAdd, isEditing, setIsEditing, currentUser, projectMap }) => {

    const userProjects = Object.keys(projectMap).map(id => ({ id, title: projectMap[id] }));
    const filteredUsers = users.filter(u => u.isActive); // Only show active users by default

    const renderActiveToggle = (user: User) => {
        const isActive = user.isActive !== false;
        return (
            <button 
                onClick={(e) => { e.stopPropagation(); onDelete(user); }} 
                className={`p-1.5 rounded transition-colors flex items-center text-sm font-medium ${isActive ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'}`}
                title={isActive ? 'Deactivate User' : 'Activate User'}
            >
                {isActive ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                <span className="ml-1 hidden md:inline">{isActive ? 'Deactivate' : 'Activate'}</span>
            </button>
        );
    };

    const UserForm = () => (
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200 mb-6">
            <h3 className="text-lg font-semibold mb-4">{currentUser ? `Edit User: ${currentUser.name}` : 'Create New User'}</h3>
            <form onSubmit={onSave} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Row 1 */}
                <div><label className="block text-sm font-medium text-gray-700">First Name</label><input required name="firstName" defaultValue={currentUser?.firstName} className="mt-1 block w-full border border-gray-300 rounded-md p-2"/></div>
                <div><label className="block text-sm font-medium text-gray-700">Last Name</label><input required name="lastName" defaultValue={currentUser?.lastName} className="mt-1 block w-full border border-gray-300 rounded-md p-2"/></div>
                <div><label className="block text-sm font-medium text-gray-700">Email</label><input required type="email" name="email" defaultValue={currentUser?.email} className="mt-1 block w-full border border-gray-300 rounded-md p-2"/></div>
                <div><label className="block text-sm font-medium text-gray-700">Login</label><input name="login" defaultValue={currentUser?.login} className="mt-1 block w-full border border-gray-300 rounded-md p-2"/></div>
                
                {/* Row 2 */}
                <div><label className="block text-sm font-medium text-gray-700">Group No.</label><input name="groupNo" defaultValue={currentUser?.groupNo} className="mt-1 block w-full border border-gray-300 rounded-md p-2"/></div>
                <div><label className="block text-sm font-medium text-gray-700">Role</label><select name="role" defaultValue={currentUser?.role || Role.CONTRIBUTOR} className="mt-1 block w-full border border-gray-300 rounded-md p-2">{Object.values(Role).map(r => <option key={r} value={r}>{r}</option>)}</select></div>
                <div><label className="block text-sm font-medium text-gray-700">Department</label><input name="department" defaultValue={currentUser?.department} className="mt-1 block w-full border border-gray-300 rounded-md p-2"/></div>
                <div><label className="block text-sm font-medium text-gray-700">Project</label>
                    <select name="projectId" defaultValue={currentUser?.projectId || ''} className="mt-1 block w-full border border-gray-300 rounded-md p-2">
                        <option value="">No Project</option>
                        {userProjects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                    </select>
                </div>

                <div className="md:col-span-4 flex justify-end space-x-3 mt-4">
                    <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                    <button type="submit" className={`px-4 py-2 ${theme.primary} text-white rounded ${theme.hover}`}>Save User</button>
                </div>
            </form>
        </div>
    );

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
                <button onClick={onAdd} className={`${theme.primary} text-white px-4 py-2 rounded-lg ${theme.hover} flex items-center transition-colors`}>
                    <Plus size={18} className="mr-2"/> Add User
                </button>
            </div>

            {isEditing && <UserForm />}

            <div className="bg-white rounded-lg shadow border border-gray-200 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 user-table">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">User / Group</th>
                            <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Contact / Login</th>
                            <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Role / Project</th>
                            <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-right text-xs text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map(user => (
                            <tr key={user.id} className={`hover:bg-gray-50 ${user.isActive === false ? 'opacity-50' : ''}`}>
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <div className={`h-10 w-10 rounded-full ${theme.lightBg} ${theme.text} flex items-center justify-center font-bold text-sm`}>{user.avatar || 'US'}</div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                                            <div className="text-xs text-gray-500 flex items-center mt-0.5"><UserIcon size={12} className="mr-1.5"/> Group: {user.groupNo || '-'}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                     <div className="text-sm text-gray-500">{user.email}</div>
                                     <div className="text-xs text-gray-400 mt-0.5">Login: {user.login || '-'}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === Role.ADMIN ? 'bg-purple-100 text-purple-800' : user.role === Role.MANAGER ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{user.role}</span>
                                    <div className="text-xs text-gray-500 mt-1.5">Proj: {user.projectId ? projectMap[user.projectId] || user.projectId : 'N/A'}</div>
                                </td>
                                <td className="px-6 py-4">
                                     <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isActive === false ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                        {user.isActive === false ? 'Inactive' : 'Active'}
                                     </span>
                                     <div className="text-xs text-gray-400 mt-1.5 flex items-center"><Clock size={10} className="mr-1"/> Updated: {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'N/A'}</div>
                                </td>
                                <td className="px-6 py-4 text-right text-sm font-medium space-x-3">
                                    <button onClick={() => onEdit(user)} className={`${theme.text} hover:underline`}>Edit</button>
                                    {renderActiveToggle(user)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}