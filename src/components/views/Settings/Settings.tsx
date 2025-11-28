
import React from 'react';
import { SettingsView } from './Settings.view';

interface Props {
    appTheme: string;
    setAppTheme: (theme: string) => void;
    sidebarTheme: string;
    setSidebarTheme: (theme: string) => void;
    compactMode: boolean;
    setCompactMode: (mode: boolean) => void;
    isBackendConnected: boolean;
    connectionError: string | null;
    onTestConnection: () => void;
    apiUrl: string;
    theme: any;
}

export const Settings: React.FC<Props> = (props) => {
    return <SettingsView {...props} />;
};
