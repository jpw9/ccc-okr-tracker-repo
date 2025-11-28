import React, { useState } from 'react';
import { UserManagementView } from './UserManagement.view';
import { User, Role, Project } from '../../../types';
import { useOkrData } from '../../../hooks/useOkrData'; // Import useOkrData to get projects

interface Props {
    users: User[];
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
    theme: any;
}

export const UserManagement: React.FC<Props> = (props) => {
    const { data: projects } = useOkrData(); // Fetch projects for mapping
    const [isEditing, setIsEditing] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    
    // Map project data for view: { id: title }
    const projectMap = projects.reduce((acc: Record<string | number, string>, project: Project) => {
        // Ensure ID is a string key for consistent lookup
        acc[String(project.id)] = project.title;
        return acc;
    }, {});

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        
        const firstName = formData.get('firstName') as string;
        const lastName = formData.get('lastName') as string;
        const projectIdStr = formData.get('projectId') as string;
        
        // Determine the project ID, defaulting to null if no selection is made
        let projectId: string | number | null = null;
        if (projectIdStr) {
            // Attempt to parse as an integer first, but keep as string if parsing fails (e.g., if IDs are GUIDs)
            const parsedId = parseInt(projectIdStr, 10);
            projectId = isNaN(parsedId) ? projectIdStr : parsedId;
        }

        const newUser: User = {
            id: currentUser ? currentUser.id : `u-${Date.now()}`,
            groupNo: formData.get('groupNo') as string,
            firstName: firstName,
            lastName: lastName,
            name: `${firstName} ${lastName}`, // Recalculate full name
            email: formData.get('email') as string,
            login: formData.get('login') as string,
            role: formData.get('role') as Role,
            department: formData.get('department') as string,
            projectId: projectId,
            avatar: (firstName.substring(0, 1) + lastName.substring(0, 1)).toUpperCase(),
            isActive: currentUser?.isActive !== undefined ? currentUser.isActive : true,
            // Auditing data mock for persistence:
            createdAt: currentUser?.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: currentUser?.createdBy || 'current_user_placeholder',
            updatedBy: 'current_user_placeholder',
        };

        if (currentUser) {
            props.setUsers(props.users.map(u => u.id === currentUser.id ? newUser : u));
        } else {
            props.setUsers([...props.users, newUser]);
        }
        setIsEditing(false);
        setCurrentUser(null);
    };

    // Soft delete: Toggles the isActive status instead of removing the user record
    const handleSoftDelete = (userToToggle: User) => {
        console.warn(`Attempting to soft-delete/toggle user ID: ${userToToggle.id}. Confirmation needed via custom modal.`);
        const newState = userToToggle.isActive === false; // Toggle the current state
        
        props.setUsers(props.users.map(u => u.id === userToToggle.id ? { 
            ...u, 
            isActive: newState,
            updatedAt: new Date().toISOString(),
            updatedBy: 'current_user_placeholder',
        } : u));
    };

    return (
        <UserManagementView 
            {...props} 
            projectMap={projectMap} // Pass project map to view
            onSave={handleSave} 
            onDelete={handleSoftDelete} // Soft delete logic
            onEdit={(u) => { setCurrentUser(u); setIsEditing(true); }} 
            onAdd={() => { setCurrentUser(null); setIsEditing(true); }} 
            isEditing={isEditing} 
            setIsEditing={setIsEditing} 
            currentUser={currentUser} 
        />
    );
};