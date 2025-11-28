
import React from 'react';
import { DashboardView } from './Dashboard.view';
import { Project } from '../../../types';

interface Props {
    data: Project[];
    isBackendConnected: boolean;
    isDbEmpty: boolean;
    connectionError: string | null;
    apiUrl: string;
    theme: any;
    onSelectProject: (id: string | number) => void;
}

export const Dashboard: React.FC<Props> = ({ data, ...rest }) => {
    const overallProgress = Math.round(data.reduce((sum, p) => sum + (p.percentage || 0), 0) / (data.length || 1));
    const activeProjects = data.length;
    const totalInitiatives = data.reduce((sum, proj) => sum + proj.initiatives.length, 0);

    return (
        <DashboardView 
            data={data}
            overallProgress={overallProgress}
            activeProjects={activeProjects}
            totalInitiatives={totalInitiatives}
            {...rest}
        />
    );
};
