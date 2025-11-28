import React, { useState, useMemo } from 'react';
import { Menu, Search, X, RefreshCcw, Save, Check, ChevronsDown, ChevronsUp } from 'lucide-react';
import { useOkrData } from './hooks/useOkrData';
import { OKRLevel } from './types';
import { THEMES, SIDEBAR_THEMES } from './theme';
import { Sidebar } from './components/layout/Sidebar/Sidebar';
import { Dashboard } from './components/views/Dashboard/Dashboard';
import OkrHierarchy from './components/okr/OkrHierarchy/OkrHierarchy';
import { UserManagement } from './components/admin/UserManagement/UserManagement';
import { ProjectManagement } from './components/views/ProjectManagement/ProjectManagement';
import { Settings } from './components/views/Settings/Settings';
import { CRUDModal } from './components/modals/CRUDModal/CRUDModal';

export default function App() {
  const { data, users, setUsers, isLoading, isBackendConnected, isDbEmpty, connectionError, saveStatus, loadData, saveData, updateActionPercentage, crudOperation, deleteOperation, API_BASE_URL } = useOkrData();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<string | number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [appTheme, setAppTheme] = useState('blue');
  const [sidebarTheme, setSidebarTheme] = useState('slate');
  const [compactMode, setCompactMode] = useState(false);
  const [globalExpandState, setGlobalExpandState] = useState<{ action: 'expand' | 'collapse', ts: number } | null>(null);
  const [modalState, setModalState] = useState<{ isOpen: boolean; mode: 'create' | 'edit'; level: OKRLevel; pathIds: (string | number)[]; existingData?: any; }>({ isOpen: false, mode: 'create', level: OKRLevel.PROJECT, pathIds: [] });

  const theme = THEMES[appTheme];
  const sidebarStyle = SIDEBAR_THEMES[sidebarTheme];

  const handleRequestOp = (op: 'create' | 'edit' | 'delete', level: OKRLevel, pathIds: (string | number)[], currentData?: any) => {
      if (op === 'delete') deleteOperation(level, pathIds);
      else setModalState({ isOpen: true, mode: op, level: level, pathIds: pathIds, existingData: currentData });
  };

  const filterData = (data: any[], query: string) => {
      if (!query.trim()) return data;
      return data.filter(d => d.title.toLowerCase().includes(query.toLowerCase())); 
  };
  const filteredData = useMemo(() => filterData(data, searchQuery), [data, searchQuery]);
  const isSearching = searchQuery.trim().length > 0;

  if (isLoading) return <div className="flex items-center justify-center h-screen bg-gray-50 text-gray-500">Loading OKR Data...</div>;

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden font-sans">
      <CRUDModal isOpen={modalState.isOpen} mode={modalState.mode} level={modalState.level} initialData={modalState.existingData} onClose={() => setModalState({...modalState, isOpen: false})} onSave={(f) => { crudOperation(modalState.mode, modalState.level, modalState.pathIds, f); setModalState({ ...modalState, isOpen: false }); }} users={users} theme={theme} />

      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} activeView={activeView} setActiveView={setActiveView} data={data} selectedProjectId={selectedProjectId} setSelectedProjectId={setSelectedProjectId} onRequestOp={handleRequestOp} isBackendConnected={isBackendConnected} theme={theme} sidebarStyle={sidebarStyle} />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 z-10 border-b border-gray-100">
          <div className="flex items-center">
            {!isSidebarOpen && <button onClick={() => setIsSidebarOpen(true)} className={`mr-4 text-gray-500 ${theme.hover}`}><Menu size={24} /></button>}
            <h1 className="text-xl font-bold text-gray-800 hidden md:block tracking-tight">
              {activeView === 'dashboard' ? 'Executive Dashboard' : activeView === 'projects' ? 'Project Management' : activeView === 'hierarchy' ? 'OKR Master Register' : activeView === 'users' ? 'User Management' : 'Settings'}
            </h1>
          </div>
          <div className="flex-1 max-w-xl mx-4 flex items-center space-x-3">
             {activeView === 'hierarchy' && (
                 <div className="flex items-center bg-gray-100 rounded-lg p-1 mr-2">
                    <button onClick={() => setGlobalExpandState({ action: 'expand', ts: Date.now() })} className={`p-1.5 hover:${theme.text}`}><ChevronsDown size={18} /></button>
                    <button onClick={() => setGlobalExpandState({ action: 'collapse', ts: Date.now() })} className={`p-1.5 hover:${theme.text}`}><ChevronsUp size={18} /></button>
                 </div>
             )}
            <div className="relative flex-1 group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search size={18} className="text-gray-400" /></div>
              <input type="text" className={`block w-full pl-10 pr-3 py-2 border rounded-xl bg-gray-50 focus:bg-white focus:ring-2 ${theme.ring}`} placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              {searchQuery && <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer" onClick={() => setSearchQuery('')}><X size={16} className="text-gray-400" /></div>}
            </div>
             <button onClick={saveData} disabled={saveStatus === 'saving'} className={`hidden md:flex items-center px-4 py-2 rounded-lg font-medium text-sm shadow-sm transition-all ${saveStatus === 'saving' ? 'bg-gray-100 text-gray-400' : saveStatus === 'success' ? 'bg-green-100 text-green-700' : 'bg-black text-white hover:bg-gray-800'}`}>
                {saveStatus === 'saving' ? <RefreshCcw size={16} className="animate-spin mr-2" /> : saveStatus === 'success' ? <Check size={16} className="mr-2" /> : <Save size={16} className="mr-2" />}
                {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'success' ? 'Saved!' : 'Save Changes'}
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
          {activeView === 'dashboard' && <Dashboard data={data} isBackendConnected={isBackendConnected} isDbEmpty={isDbEmpty} connectionError={connectionError} apiUrl={API_BASE_URL} theme={theme} onSelectProject={(id) => { setSelectedProjectId(id); setActiveView('hierarchy'); }} />}
          {activeView === 'projects' && <ProjectManagement data={data} onRequestOp={handleRequestOp} theme={theme} onSelectProject={(id) => { setSelectedProjectId(id); setActiveView('hierarchy'); }} />}
          {activeView === 'hierarchy' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              {isSearching ? filteredData.map(proj => (
                  <OkrHierarchy key={proj.id} data={proj} onActionUpdate={(sId, gId, oId, kId, aId, val) => updateActionPercentage(proj.id, sId, gId, oId, kId, aId, val)} onRequestOp={handleRequestOp} globalExpandState={globalExpandState} theme={theme} compactMode={compactMode} isSearching={true} />
              )) : (
                  selectedProjectId ? (
                    <OkrHierarchy data={data.find(d => String(d.id) === String(selectedProjectId))!} onActionUpdate={(sId, gId, oId, kId, aId, val) => updateActionPercentage(selectedProjectId, sId, gId, oId, kId, aId, val)} onRequestOp={handleRequestOp} globalExpandState={globalExpandState} theme={theme} compactMode={compactMode} />
                  ) : <div className="text-center py-20 text-gray-500 bg-white rounded-xl border border-dashed border-gray-200">Select a Project to view details.</div>
              )}
            </div>
          )}
          {activeView === 'users' && <UserManagement users={users} setUsers={setUsers} theme={theme} />}
          {activeView === 'settings' && (
            <Settings 
                appTheme={appTheme} 
                setAppTheme={setAppTheme} 
                sidebarTheme={sidebarTheme} 
                setSidebarTheme={setSidebarTheme} 
                compactMode={compactMode} 
                setCompactMode={setCompactMode} 
                isBackendConnected={isBackendConnected} 
                connectionError={connectionError} 
                onTestConnection={loadData} 
                apiUrl={API_BASE_URL} 
                theme={theme} 
            />
          )}
        </main>
      </div>
    </div>
  );
}