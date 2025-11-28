
import React from 'react';
import { LayoutDashboard, FolderTree, Users, Settings, Plus, Menu, Briefcase } from 'lucide-react';
import { Project } from '../../../types';
import './Sidebar.css';

interface SidebarViewProps {
    isOpen: boolean;
    setIsOpen: (val: boolean) => void;
    activeView: string;
    setActiveView: (view: any) => void;
    data: Project[];
    selectedProjectId: string | number | null;
    setSelectedProjectId: (id: string | number | null) => void;
    onCreateProject: () => void;
    isBackendConnected: boolean;
    theme: any;
    sidebarStyle: any;
}

export const SidebarView: React.FC<SidebarViewProps> = ({
    isOpen, setIsOpen, activeView, setActiveView, data, selectedProjectId, setSelectedProjectId, onCreateProject, isBackendConnected, theme, sidebarStyle
}) => {
    return (
        <aside className={`${isOpen ? 'w-72' : 'w-0'} ${sidebarStyle.className} sidebar-container flex flex-col overflow-hidden shadow-xl`}>
            <div className={`p-4 ${sidebarStyle.border} border-b flex items-center justify-between`}>
                <div className="font-bold text-xl tracking-wider flex items-center">
                    <div className={`w-8 h-8 rounded-lg ${theme.primary} mr-3 flex items-center justify-center text-white shadow-lg`}>CCC</div>
                    OKR
                </div>
                <button onClick={() => setIsOpen(false)} className={`${sidebarStyle.text} hover:text-white focus:outline-none`}>
                    <Menu size={20} />
                </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-4 custom-scrollbar">
                <div className={`px-6 mb-2 text-xs font-bold ${sidebarStyle.text} uppercase tracking-wider`}>Main Menu</div>
                
                <NavButton icon={LayoutDashboard} label="Dashboard" active={activeView === 'dashboard'} onClick={() => setActiveView('dashboard')} theme={theme} sidebar={sidebarStyle} />
                <NavButton icon={Briefcase} label="Projects" active={activeView === 'projects'} onClick={() => setActiveView('projects')} theme={theme} sidebar={sidebarStyle} />
                <NavButton icon={FolderTree} label="OKR Register" active={activeView === 'hierarchy'} onClick={() => setActiveView('hierarchy')} theme={theme} sidebar={sidebarStyle} />
                <NavButton icon={Users} label="User Management" active={activeView === 'users'} onClick={() => setActiveView('users')} theme={theme} sidebar={sidebarStyle} />
                <NavButton icon={Settings} label="Settings" active={activeView === 'settings'} onClick={() => setActiveView('settings')} theme={theme} sidebar={sidebarStyle} />

                <div className="px-6 mt-8 mb-2 flex justify-between items-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <span className={sidebarStyle.text}>Projects</span>
                    <button onClick={onCreateProject} className={`p-1 hover:bg-opacity-20 hover:bg-white rounded ${sidebarStyle.text} hover:text-white transition-colors`} title="Add New Project">
                        <Plus size={14} />
                    </button>
                </div>
                <div className="space-y-1 px-2">
                    {data.map(proj => (
                        <button
                            key={proj.id}
                            onClick={() => { setActiveView('hierarchy'); setSelectedProjectId(proj.id); }}
                            className={`w-full flex items-center px-4 py-2.5 text-sm rounded-lg transition-all duration-200 group ${String(selectedProjectId) === String(proj.id) && activeView === 'hierarchy' ? `${sidebarStyle.active} text-white shadow-md` : `${sidebarStyle.text} ${sidebarStyle.hover} hover:bg-white/5`}`}
                        >
                            <div className={`w-2.5 h-2.5 rounded-full mr-3 flex-shrink-0 ring-2 ring-opacity-20 ring-white ${proj.percentage && proj.percentage === 100 ? 'bg-green-500' : proj.percentage && proj.percentage > 50 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                            <span className="truncate text-left font-medium">
                                {proj.title}
                            </span>
                        </button>
                    ))}
                </div>
            </nav>
            <div className={`p-4 ${sidebarStyle.border} border-t bg-opacity-50 bg-black/10`}>
                <div className="flex items-center">
                    <div className="relative">
                        <div className={`w-9 h-9 rounded-full ${theme.primary} flex items-center justify-center text-xs font-bold text-white shadow-md`}>AD</div>
                        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-black ${isBackendConnected ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                    </div>
                    <div className="ml-3 overflow-hidden">
                        <p className="text-sm font-medium text-white truncate">Admin User</p>
                        <p className={`text-xs ${sidebarStyle.text} truncate`}>{isBackendConnected ? 'Online' : 'Offline Mode'}</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

const NavButton = ({ icon: Icon, label, active, onClick, theme, sidebar }: any) => (
    <button onClick={onClick} className={`w-full flex items-center px-4 py-3 mb-1 text-sm font-medium rounded-lg transition-all duration-200 group ${active ? `${theme.primary} text-white shadow-md` : `${sidebar.text} ${sidebar.hover} hover:bg-white/10`}`}>
        <Icon size={18} className={`mr-3 transition-transform group-hover:scale-110 ${active ? 'text-white' : sidebar.text}`} />
        {label}
    </button>
);
