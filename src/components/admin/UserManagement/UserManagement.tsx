
import React, { useState } from 'react';
import { UserManagementView } from './UserManagement.view';
import { User, Role } from '../../../types';

interface Props {
    users: User[];
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
    theme: any;
}

export const UserManagement: React.FC<Props> = (props) => {
    const [isEditing, setIsEditing] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const newUser: User = {
            id: currentUser ? currentUser.id : `u-${Date.now()}`,
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            role: formData.get('role') as Role,
            department: formData.get('department') as string,
            avatar: (formData.get('name') as string).split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
        };
        if (currentUser) props.setUsers(props.users.map(u => u.id === currentUser.id ? newUser : u)); else props.setUsers([...props.users, newUser]);
        setIsEditing(false);
        setCurrentUser(null);
    };

    return <UserManagementView {...props} onSave={handleSave} onDelete={(id) => { if(confirm("Delete?")) props.setUsers(props.users.filter(u => u.id !== id)); }} onEdit={(u) => { setCurrentUser(u); setIsEditing(true); }} onAdd={() => { setCurrentUser(null); setIsEditing(true); }} isEditing={isEditing} setIsEditing={setIsEditing} currentUser={currentUser} />;
};
