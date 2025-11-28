
import React from 'react';
import { LayoutDashboard, Target, ChevronRight, AlertTriangle, Database, Briefcase } from 'lucide-react';
import { Project } from '../../../types';
import './Dashboard.css';

interface DashboardViewProps {
    data: Project[];
    overallProgress: number;
    activeProjects: number;
    totalInitiatives: number;
    isBackendConnected: boolean;
    isDbEmpty: boolean;
    connectionError: string | null;
    apiUrl: string;
    theme: any;
    onSelectProject: (id: string | number) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
    data, overallProgress, activeProjects, totalInitiatives, isBackendConnected, isDbEmpty, connectionError, apiUrl, theme, onSelectProject
}) => {
    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {!isBackendConnected && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start shadow-sm">
                    <AlertTriangle className="text-amber-500 mt-0.5 mr-3 flex-shrink-0" size={20} />
                    <div>
                        <h3 className="text-sm font-bold text-amber-800">Backend Offline (Mock Mode)</h3>
                        <p className="text-sm text-amber-700 mt-1">
                            We couldn't connect to <code>{apiUrl}</code>. Ensure Spring Boot is running.
                            <br/><span className="text-xs text-amber-600 mt-1 block">Error: {connectionError || 'Connection refused'}</span>
                        </p>
                    </div>
                </div>
            )}

            {isBackendConnected && isDbEmpty && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start shadow-sm">
                        <Database className="text-blue-500 mt-0.5 mr-3 flex-shrink-0" size={20} />
                        <div>
                            <h3 className="text-sm font-bold text-blue-800">Connected to Empty Database</h3>
                            <p className="text-sm text-blue-700 mt-1">
                                Your backend is online, but the database is empty. 
                                <strong>Click "Save Changes"</strong> to seed your database.
                            </p>
                        </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <DashboardCard title="Total Progress" value={`${overallProgress}%`} subtext="Company Wide" theme={theme}>
                    <div className="w-full bg-gray-100 rounded-full h-3 mt-4 overflow-hidden">
                        <div className={`${theme.progress} h-3 rounded-full dashboard-card-transition shadow-sm`} style={{ width: `${overallProgress}%` }}></div>
                    </div>
                </DashboardCard>
                <DashboardCard title="Active Projects" value={activeProjects} subtext="High Level" theme={theme} icon={<Briefcase className={`text-gray-300 absolute top-4 right-4`} size={40} opacity={0.1} />} />
                <DashboardCard title="Strategic Initiatives" value={totalInitiatives} subtext="Across Projects" theme={theme} icon={<Target className={`text-gray-300 absolute top-4 right-4`} size={40} opacity={0.1} />} />
            </div>

            <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4 px-1">Project Status</h2>
                <div className="grid grid-cols-1 gap-4">
                    {data.map(proj => (
                        <div key={proj.id} className={`bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-${theme.primary.replace('bg-', 'border-').replace('600', '300')} transition-all duration-200 cursor-pointer group`} onClick={() => onSelectProject(proj.id)}>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-gray-700 transition-colors">{proj.title}</h3>
                                    <p className="text-sm text-gray-500 mt-1 leading-relaxed max-w-3xl">{proj.description}</p>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-sm font-bold shadow-sm ${ (proj.percentage || 0) >= 75 ? 'bg-green-100 text-green-800' : (proj.percentage || 0) >= 40 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                                    {proj.percentage}%
                                </div>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                <div className={`h-2.5 rounded-full dashboard-card-transition ${ (proj.percentage || 0) >= 75 ? 'bg-green-500' : (proj.percentage || 0) >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${proj.percentage}%` }}></div>
                            </div>
                            <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
                                <span className="flex items-center"><Target size={16} className="mr-1"/> {proj.initiatives.length} Initiatives</span>
                                <span className={`flex items-center font-medium ${theme.text} opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0`}>View Details <ChevronRight size={16} className="ml-1" /></span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const DashboardCard = ({ title, value, subtext, theme, icon, children }: any) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 relative overflow-hidden group hover:shadow-md transition-all">
        <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">{title}</h3>
        <div className="flex items-end items-baseline relative z-10">
            <span className="text-4xl font-bold text-gray-900">{value}</span>
            <span className={`text-sm ml-2 font-medium ${theme.text}`}>{subtext}</span>
        </div>
        {children}
        {icon}
    </div>
);
