
import React from 'react';
import { Plus, Edit2, Save } from 'lucide-react';
import { OKRLevel, User } from '../../../types';
import './CRUDModal.css';

interface Props {
    isOpen: boolean;
    mode: 'create' | 'edit';
    level: OKRLevel;
    formData: any;
    setFormData: (data: any) => void;
    onClose: () => void;
    onSave: () => void;
    users: User[];
    theme: any;
}

export const CRUDModalView: React.FC<Props> = ({ isOpen, mode, level, formData, setFormData, onClose, onSave, users, theme }) => {
    if (!isOpen) return null;
    const isAction = level === OKRLevel.ACTION;
    const canAssign = level === OKRLevel.OBJECTIVE || level === OKRLevel.KR || level === OKRLevel.ACTION;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 modal-backdrop">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl transform transition-all">
                <h3 className="text-lg font-bold mb-4 capitalize flex items-center">
                    {mode === 'create' ? <Plus size={20} className={`mr-2 ${theme.text}`} /> : <Edit2 size={20} className={`mr-2 ${theme.text}`} />}
                    {mode} {level}
                </h3>
                <div className="space-y-4">
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">{isAction ? 'Action Description' : 'Title'}</label><input type="text" className={`w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 ${theme.ring}`} value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} autoFocus /></div>
                    {!isAction && <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea className={`w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 ${theme.ring}`} rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} /></div>}
                    {canAssign && <div><label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label><select className={`w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 ${theme.ring}`} value={formData.assignee} onChange={e => setFormData({...formData, assignee: e.target.value})}><option value="">Unassigned</option>{users.map(u => <option key={u.id} value={u.name}>{u.name}</option>)}</select></div>}
                </div>
                <div className="mt-6 flex justify-end space-x-3"><button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md">Cancel</button><button onClick={onSave} className={`px-4 py-2 ${theme.primary} text-white rounded-md ${theme.hover} flex items-center shadow-md`} disabled={!formData.title.trim()}><Save size={16} className="mr-2" /> Save</button></div>
            </div>
        </div>
    );
}
