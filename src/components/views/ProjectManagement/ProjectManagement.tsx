
import React from 'react';
import { ProjectManagementView } from './ProjectManagement.view';
import { Project, OKRLevel } from '../../../types';

interface Props {
    data: Project[];
    onRequestOp: (op: 'create' | 'edit' | 'delete', level: OKRLevel, pathIds: (string | number)[], currentData?: any) => void;
    theme: any;
    onSelectProject: (id: string | number) => void;
}

export const ProjectManagement: React.FC<Props> = (props) => {
    return <ProjectManagementView {...props} />;
};
