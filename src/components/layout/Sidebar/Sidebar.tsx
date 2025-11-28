
import React from 'react';
import { SidebarView } from './Sidebar.view';
import { Project, OKRLevel } from '../../../types';

interface Props {
    isOpen: boolean;
    setIsOpen: (val: boolean) => void;
    activeView: string;
    setActiveView: (view: any) => void;
    data: Project[];
    selectedProjectId: string | number | null;
    setSelectedProjectId: (id: string | number | null) => void;
    onRequestOp: (op: 'create', level: OKRLevel, pathIds: (string | number)[]) => void;
    isBackendConnected: boolean;
    theme: any;
    sidebarStyle: any;
}

export const Sidebar: React.FC<Props> = (props) => {
    const handleCreateProject = () => {
        props.onRequestOp('create', OKRLevel.PROJECT, []);
    };

    return <SidebarView {...props} onCreateProject={handleCreateProject} />;
};
