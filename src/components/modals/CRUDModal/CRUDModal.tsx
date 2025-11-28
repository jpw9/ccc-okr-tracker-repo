
import React, { useState, useEffect } from 'react';
import { CRUDModalView } from './CRUDModal.view';
import { OKRLevel, User } from '../../../types';

interface Props {
    isOpen: boolean;
    mode: 'create' | 'edit';
    level: OKRLevel;
    initialData?: any;
    onClose: () => void;
    onSave: (data: any) => void;
    users: User[];
    theme: any;
}

export const CRUDModal: React.FC<Props> = (props) => {
    const [formData, setFormData] = useState({ title: '', description: '', assignee: '' });
    useEffect(() => {
        if (props.isOpen && props.initialData) {
            setFormData({ title: props.initialData.title || props.initialData.description || '', description: props.initialData.description || '', assignee: props.initialData.assignee || '' });
        } else {
            setFormData({ title: '', description: '', assignee: '' });
        }
    }, [props.isOpen, props.initialData]);

    return <CRUDModalView {...props} formData={formData} setFormData={setFormData} onSave={() => props.onSave(formData)} />;
};
