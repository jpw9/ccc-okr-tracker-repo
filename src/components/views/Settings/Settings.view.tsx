
import React from 'react';
import { Check } from 'lucide-react';
import { THEMES, SIDEBAR_THEMES } from '../../../theme';
import './Settings.css';

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

export const SettingsView: React.FC<Props> = ({ 
    appTheme, setAppTheme, sidebarTheme, setSidebarTheme, compactMode, setCompactMode,
    isBackendConnected, connectionError, onTestConnection, apiUrl, theme 
}) => {
    return (
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Application Settings</h2>
                <p className="text-gray-500">Customize the look and feel of your workspace.</p>
            </div>
            
            <div className="p-8 space-y-8">
                {/* Theme Color Selection */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 settings-section-title">Brand Color Theme</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {Object.keys(THEMES).map((key) => (
                            <button 
                                key={key}
                                onClick={() => setAppTheme(key)}
                                className={`group relative flex flex-col items-center p-4 rounded-xl border-2 transition-all ${appTheme === key ? `border-${key}-500 bg-${key}-50` : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
                            >
                                <div className={`w-12 h-12 rounded-full ${THEMES[key].primary} shadow-lg mb-3 group-hover:scale-110 transition-transform`}></div>
                                <span className={`font-medium ${appTheme === key ? 'text-gray-900' : 'text-gray-500'}`}>{THEMES[key].name}</span>
                                {appTheme === key && <div className="absolute top-2 right-2"><Check size={16} className={`text-${key}-600`} /></div>}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Sidebar Theme Selection */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 settings-section-title">Sidebar Appearance</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {Object.keys(SIDEBAR_THEMES).map((key) => (
                            <button 
                                key={key}
                                onClick={() => setSidebarTheme(key)}
                                className={`relative p-4 rounded-xl border-2 text-left transition-all overflow-hidden ${sidebarTheme === key ? `${theme.border} ring-1 ring-${appTheme}-500` : 'border-gray-200'}`}
                            >
                                <div className={`absolute inset-0 ${SIDEBAR_THEMES[key].className} opacity-90`}></div>
                                <div className="relative z-10 flex items-center justify-between">
                                    <span className={`font-medium ${key === 'light' ? 'text-gray-900' : 'text-white'}`}>{SIDEBAR_THEMES[key].name}</span>
                                    {sidebarTheme === key && <div className={`bg-white rounded-full p-1`}><Check size={12} className="text-black" /></div>}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Compact Mode Toggle */}
                <div>
                     <h3 className="text-lg font-semibold text-gray-800 mb-4 settings-section-title">View Options</h3>
                     <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <div>
                            <div className="font-medium text-gray-900">Compact Mode</div>
                            <div className="text-sm text-gray-500">Reduces spacing and padding for higher information density.</div>
                        </div>
                        <button 
                            onClick={() => setCompactMode(!compactMode)}
                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${compactMode ? theme.primary : 'bg-gray-200'}`}
                        >
                            <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${compactMode ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                     </div>
                </div>

                {/* Connection Test */}
                <div>
                     <h3 className="text-lg font-semibold text-gray-800 mb-4 settings-section-title">Backend Connection</h3>
                     <div className={`flex items-center justify-between p-4 rounded-xl border ${isBackendConnected ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
                        <div>
                            <div className={`font-medium ${isBackendConnected ? 'text-green-800' : 'text-amber-800'}`}>
                                Status: {isBackendConnected ? 'Connected' : 'Disconnected / Offline'}
                            </div>
                            <div className="text-sm text-gray-500">
                                URL: <code>{apiUrl}</code>
                            </div>
                            {!isBackendConnected && connectionError && (
                                <div className="text-xs text-red-600 mt-1 font-medium bg-red-50 p-1 rounded">
                                    Error: {connectionError}
                                </div>
                            )}
                        </div>
                        <button 
                            onClick={onTestConnection}
                            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${isBackendConnected ? 'bg-white border-green-300 text-green-700 hover:bg-green-50' : 'bg-white border-amber-300 text-amber-700 hover:bg-amber-50'}`}
                        >
                            Test Connection
                        </button>
                     </div>
                </div>
            </div>
        </div>
    );
}
