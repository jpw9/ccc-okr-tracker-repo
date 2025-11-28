
import React from 'react';
import { Plus, Target, ArrowRight, Edit2, Trash2, User, Clock, Briefcase } from 'lucide-react';
import { Project, OKRLevel } from '../../../types';
import './ProjectManagement.css';

interface Props {
    data: Project[];
    onRequestOp: (op: 'create' | 'edit' | 'delete', level: OKRLevel, pathIds: (string | number)[], currentData?: any) => void;
    theme: any;
    onSelectProject: (id: string | number) => void;
}

export const ProjectManagementView: React.FC<Props> = ({ data, onRequestOp, theme, onSelectProject }) => {
    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center px-1">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Project Management</h2>
                    <p className="text-gray-500 text-sm mt-1">Manage high-level projects and their strategic initiatives.</p>
                </div>
                <button 
                    onClick={() => onRequestOp('create', OKRLevel.PROJECT, [])}
                    className={`${theme.primary} text-white px-5 py-2.5 rounded-lg ${theme.hover} flex items-center transition-all shadow-md`}
                >
                    <Plus size={18} className="mr-2"/> New Project
                </button>
            </div>

            {data.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center border-2 border-dashed border-gray-300">
                    <Briefcase className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No Projects Found</h3>
                    <p className="text-gray-500 mt-2 mb-6">Get started by creating your first project.</p>
                    <button onClick={() => onRequestOp('create', OKRLevel.PROJECT, [])} className={`${theme.text} font-medium hover:underline`}>
                        Create Project
                    </button>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200 project-table">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs text-gray-500 uppercase">Project Name</th>
                                <th className="px-6 py-4 text-left text-xs text-gray-500 uppercase">Progress</th>
                                <th className="px-6 py-4 text-left text-xs text-gray-500 uppercase hidden md:table-cell">Metadata</th>
                                <th className="px-6 py-4 text-left text-xs text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-4 text-right text-xs text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {data.map((project) => (
                                <tr key={project.id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col cursor-pointer" onClick={() => onSelectProject(project.id)}>
                                            <span className={`text-sm font-bold text-gray-900 group-hover:${theme.text} transition-colors`}>{project.title}</span>
                                            <span className="text-xs text-gray-500 mt-1 line-clamp-1 max-w-md">{project.description || 'No description provided.'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 w-48">
                                        <div className="flex items-center">
                                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden mr-3">
                                                <div className={`h-full rounded-full ${theme.progress}`} style={{ width: `${project.percentage}%` }}></div>
                                            </div>
                                            <span className="text-sm font-semibold text-gray-700 w-8">{project.percentage}%</span>
                                        </div>
                                        <div className="text-[10px] text-gray-400 mt-1 flex items-center">
                                            <Target size={10} className="mr-1"/> {project.initiatives.length} Initiatives
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 hidden md:table-cell">
                                        <div className="flex flex-col space-y-1">
                                            {project.createdBy && (
                                                <div className="text-xs text-gray-500 flex items-center" title={`Created: ${project.createdAt}`}>
                                                    <User size={12} className="mr-1.5 text-gray-400"/> Created by {project.createdBy}
                                                </div>
                                            )}
                                            {project.updatedAt && (
                                                <div className="text-xs text-gray-500 flex items-center">
                                                    <Clock size={12} className="mr-1.5 text-gray-400"/> Updated: {new Date(project.updatedAt).toLocaleDateString()}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ (project.percentage || 0) >= 100 ? 'bg-green-100 text-green-800' : (project.percentage || 0) > 0 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                                            { (project.percentage || 0) >= 100 ? 'Completed' : (project.percentage || 0) > 0 ? 'In Progress' : 'Planned' }
                                         </span>
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm font-medium">
                                        <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => onRequestOp('edit', OKRLevel.PROJECT, [project.id], project)} className="p-1.5 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100" title="Edit"><Edit2 size={16}/></button>
                                            <button onClick={() => onRequestOp('delete', OKRLevel.PROJECT, [project.id])} className="p-1.5 text-gray-400 hover:text-red-600 rounded hover:bg-red-50" title="Delete"><Trash2 size={16}/></button>
                                            <button onClick={() => onSelectProject(project.id)} className={`p-1.5 ${theme.text} hover:bg-${theme.name.split(' ')[0].toLowerCase()}-50 rounded`} title="View Hierarchy"><ArrowRight size={16}/></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};
