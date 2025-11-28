
import React, { useState, useEffect } from 'react';
import { Project, OKRLevel } from '../../../types';
import { Edit2, Trash2, Plus, ChevronDown, ChevronRight, Target, Award, CheckSquare, User, LayoutDashboard } from 'lucide-react';
import './OkrHierarchy.css';

interface Props {
  data: Project;
  onActionUpdate: (stratId: string | number, goalId: string | number, objId: string | number, krId: string | number, actId: string | number, val: number) => void;
  onRequestOp: (op: 'create' | 'edit' | 'delete', level: OKRLevel, pathIds: (string | number)[], currentData?: any) => void;
  isSearching?: boolean;
  globalExpandState?: { action: 'expand' | 'collapse', ts: number } | null;
  theme: any;
  compactMode: boolean;
}

export const OkrHierarchyView: React.FC<Props> = ({ data, onActionUpdate, onRequestOp, isSearching = false, globalExpandState = null, theme, compactMode }) => {
  return (
    <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden transition-all hover:shadow-md">
      <div className={`border-b border-gray-200 bg-gray-50 group relative ${compactMode ? 'p-4' : 'p-6'}`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
             <div className={`p-2 rounded-lg ${theme.lightBg} text-${theme.primary.replace('bg-', '')}-700`}>
                 <LayoutDashboard size={20} />
             </div>
             <h2 className={`font-bold text-gray-800 ${compactMode ? 'text-xl' : 'text-2xl'}`}>{data.title}</h2>
          </div>
          <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-full text-sm font-bold ${ (data.percentage || 0) >= 75 ? 'bg-green-100 text-green-800' : `${theme.lightBg} ${theme.lightText}`}`}>
                 {data.percentage}% Project Complete
              </span>
              <div className="hidden group-hover:flex items-center space-x-1 ml-4">
                  <button onClick={() => onRequestOp('edit', OKRLevel.PROJECT, [data.id], data)} className={`p-1.5 text-gray-500 hover:bg-white hover:${theme.text} rounded transition-colors shadow-sm`}><Edit2 size={16} /></button>
                  <button onClick={() => onRequestOp('delete', OKRLevel.PROJECT, [data.id])} className="p-1.5 text-gray-500 hover:bg-white hover:text-red-600 rounded transition-colors shadow-sm"><Trash2 size={16} /></button>
              </div>
          </div>
        </div>
        {!compactMode && <p className="text-gray-600 mt-2 max-w-4xl">{data.description}</p>}
        <button onClick={() => onRequestOp('create', OKRLevel.INITIATIVE, [data.id])} className={`absolute bottom-0 right-0 translate-y-1/2 mr-8 ${theme.primary} text-white rounded-full p-2 shadow-lg ${theme.hover} transition-transform hover:scale-105 z-10`} title="Add Initiative"><Plus size={20} /></button>
      </div>
      
      <div className={`${compactMode ? 'p-4 space-y-4' : 'p-6 space-y-8'}`}>
        {data.initiatives.map((strat) => (
           <InitiativeNodeView key={strat.id} initiative={strat} projId={data.id} onUpdate={(gId, oId, krId, actId, val) => onActionUpdate(strat.id, gId, oId, krId, actId, val)} onRequestOp={onRequestOp} isSearching={isSearching} globalExpandState={globalExpandState} theme={theme} compactMode={compactMode} />
        ))}
        {data.initiatives.length === 0 && <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg"><p className="text-gray-400 mb-2">No strategic initiatives defined yet.</p></div>}
      </div>
    </div>
  );
}

const InitiativeNodeView = ({ initiative, projId, onUpdate, onRequestOp, isSearching, globalExpandState, theme, compactMode }: any) => {
    const [expanded, setExpanded] = useState(true);
    useEffect(() => { if (isSearching) setExpanded(true); }, [isSearching]);
    useEffect(() => { if (globalExpandState) setExpanded(globalExpandState.action === 'expand'); }, [globalExpandState]);
    const path = [projId, initiative.id];

    return (
        <div className={`border-l-4 ${theme.border} pl-4 ml-2`}>
            <div className="flex items-center justify-between group mb-4">
                <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setExpanded(!expanded)}>
                    {expanded ? <ChevronDown size={20} className="text-gray-400"/> : <ChevronRight size={20} className="text-gray-400"/>}
                    <h3 className="text-lg font-bold text-gray-800">{initiative.title}</h3>
                    <div className="hidden group-hover:flex items-center space-x-1 ml-2">
                        <button onClick={(e) => { e.stopPropagation(); onRequestOp('edit', OKRLevel.INITIATIVE, path, initiative); }} className="p-1 text-gray-400 hover:text-blue-600"><Edit2 size={14}/></button>
                        <button onClick={(e) => { e.stopPropagation(); onRequestOp('delete', OKRLevel.INITIATIVE, path); }} className="p-1 text-gray-400 hover:text-red-600"><Trash2 size={14}/></button>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <span className="text-sm font-semibold">{initiative.percentage}%</span>
                    <button onClick={() => onRequestOp('create', OKRLevel.GOAL, path)} className={`text-sm ${theme.text} hover:underline flex items-center`}><Plus size={14} className="mr-1"/> Add Goal</button>
                </div>
            </div>
            {expanded && (
                <div className="space-y-4">
                    {initiative.goals.map((goal: any) => (
                        <GoalNodeView key={goal.id} goal={goal} path={[...path, goal.id]} onUpdate={(oId: any, krId: any, actId: any, val: any) => onUpdate(goal.id, oId, krId, actId, val)} onRequestOp={onRequestOp} isSearching={isSearching} globalExpandState={globalExpandState} theme={theme} compactMode={compactMode} />
                    ))}
                    {initiative.goals.length === 0 && <div className="ml-6 text-sm text-gray-400 italic">No goals yet.</div>}
                </div>
            )}
        </div>
    );
};

const GoalNodeView = ({ goal, path, onUpdate, onRequestOp, isSearching, globalExpandState, theme, compactMode }: any) => {
  const [expanded, setExpanded] = useState(true);
  useEffect(() => { if (isSearching) setExpanded(true); }, [isSearching]);
  useEffect(() => { if (globalExpandState) setExpanded(globalExpandState.action === 'expand'); }, [globalExpandState]);

  return (
    <div className={`border ${theme.border} rounded-lg overflow-hidden shadow-sm group transition-all`}>
      <div className={`${compactMode ? 'p-2.5' : 'p-4'} bg-white flex items-center justify-between cursor-pointer hover:bg-gray-50`} onClick={(e: any) => { if(!e.target.closest('button')) setExpanded(!expanded); }}>
        <div className="flex items-center space-x-3 flex-1">
          <div className={`p-1 rounded-md ${theme.lightBg} ${theme.text}`}>{expanded ? <ChevronDown size={16}/> : <ChevronRight size={16}/>}</div>
          <Target className={theme.text} size={20} />
          <div className="flex-1"><h3 className={`font-bold text-gray-800 flex items-center ${compactMode ? 'text-sm' : 'text-base'}`}>{goal.title}<div className="ml-3 hidden group-hover:flex items-center space-x-1 opacity-0 group-hover:opacity-100"><button onClick={() => onRequestOp('edit', OKRLevel.GOAL, path, goal)} className="p-1 text-gray-400"><Edit2 size={14}/></button><button onClick={() => onRequestOp('delete', OKRLevel.GOAL, path)} className="p-1 text-gray-400 hover:text-red-600"><Trash2 size={14}/></button><button onClick={() => onRequestOp('create', OKRLevel.OBJECTIVE, path)} className="p-1 text-gray-400 hover:text-green-600"><Plus size={14}/></button></div></h3></div>
        </div>
        <div className="flex items-center space-x-4"><div className={`w-32 bg-gray-200 rounded-full h-2`}><div className={`${theme.progress} h-2 rounded-full`} style={{ width: `${goal.percentage}%` }}></div></div><span className="text-sm font-semibold w-8 text-right">{goal.percentage}%</span></div>
      </div>
      {expanded && <div className={`${compactMode ? 'p-3 ml-4' : 'p-4 ml-6'} bg-white border-t border-gray-100 space-y-3 border-l-2 border-gray-100`}>
          {goal.objectives.map((obj: any) => <ObjectiveNodeView key={obj.id} objective={obj} path={[...path, obj.id]} onUpdate={(krId: any, actId: any, val: any) => onUpdate(obj.id, krId, actId, val)} onRequestOp={onRequestOp} isSearching={isSearching} globalExpandState={globalExpandState} theme={theme} compactMode={compactMode} />)}
          <button onClick={() => onRequestOp('create', OKRLevel.OBJECTIVE, path)} className={`w-full py-2 border border-dashed border-gray-300 rounded text-sm text-gray-400 hover:${theme.text} flex items-center justify-center`}><Plus size={14} className="mr-1"/> Add Objective</button>
      </div>}
    </div>
  );
};

const ObjectiveNodeView = ({ objective, path, onUpdate, onRequestOp, isSearching, globalExpandState, theme, compactMode }: any) => {
   const [expanded, setExpanded] = useState(true);
   useEffect(() => { if (isSearching) setExpanded(true); }, [isSearching]);
   useEffect(() => { if (globalExpandState) setExpanded(globalExpandState.action === 'expand'); }, [globalExpandState]);

   return (
     <div className={`mb-4 group/obj ${compactMode ? 'mb-2' : 'mb-4'}`}>
        <div className={`flex items-center justify-between cursor-pointer ${compactMode ? 'py-1' : 'py-2'}`} onClick={(e: any) => { if(!e.target.closest('button')) setExpanded(!expanded); }}>
           <div className="flex items-center space-x-2 flex-1">{expanded ? <ChevronDown size={16} className="text-gray-300"/> : <ChevronRight size={16} className="text-gray-300"/>}<Award className={theme.accent} size={16} /><div className="flex flex-col"><div className="flex items-center"><span className={`font-medium text-gray-700 group-hover/obj:${theme.text}`}>{objective.title}</span>{objective.assignee && <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ${theme.lightBg} ${theme.lightText}`}><User size={10} className="mr-1"/> {objective.assignee}</span>}</div><div className="hidden group-hover/obj:flex items-center space-x-1 mt-1"><button onClick={() => onRequestOp('edit', OKRLevel.OBJECTIVE, path, objective)} className="p-1 text-gray-300"><Edit2 size={12}/></button><button onClick={() => onRequestOp('delete', OKRLevel.OBJECTIVE, path)} className="p-1 text-gray-300 hover:text-red-600"><Trash2 size={12}/></button><button onClick={() => onRequestOp('create', OKRLevel.KR, path)} className="p-1 text-gray-300 hover:text-green-600"><Plus size={12}/></button></div></div></div>
           <div className="text-sm font-medium text-gray-500 px-2 py-1 bg-gray-50 rounded border border-gray-100">{objective.percentage}%</div>
        </div>
        {expanded && <div className={`${compactMode ? 'ml-6 mt-1 space-y-2' : 'ml-8 mt-2 space-y-4'}`}>{objective.keyResults.map((kr: any) => <KRNodeView key={kr.id} kr={kr} path={[...path, kr.id]} onUpdate={(actId: any, val: any) => onUpdate(kr.id, actId, val)} onRequestOp={onRequestOp} isSearching={isSearching} globalExpandState={globalExpandState} theme={theme} compactMode={compactMode} />)}<button onClick={() => onRequestOp('create', OKRLevel.KR, path)} className={`text-xs text-gray-400 hover:${theme.text} flex items-center ml-1`}><Plus size={12} className="mr-1"/> Add Key Result</button></div>}
     </div>
   );
}

const KRNodeView = ({ kr, path, onUpdate, onRequestOp, isSearching, globalExpandState, theme, compactMode }: any) => {
    const [expanded, setExpanded] = useState(false);
    useEffect(() => { if (isSearching) setExpanded(true); }, [isSearching]);
    useEffect(() => { if (globalExpandState) setExpanded(globalExpandState.action === 'expand'); }, [globalExpandState]);

    return (
      <div className="bg-gray-50/50 rounded-md border border-gray-200 group/kr hover:bg-white hover:shadow-sm transition-all">
         <div className={`flex items-start justify-between cursor-pointer ${compactMode ? 'p-2' : 'p-3'}`} onClick={(e: any) => { if(!e.target.closest('button') && !e.target.closest('input')) setExpanded(!expanded); }}>
            <div className="flex items-start space-x-2 flex-1"><CheckSquare className="text-gray-400 mt-0.5 flex-shrink-0" size={16} /><div className="flex-1"><div className="flex flex-col"><div className="flex items-center"><p className={`font-semibold text-gray-700 mr-2 ${compactMode ? 'text-xs' : 'text-sm'}`}>{kr.title}</p>{kr.assignee && <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-200 text-gray-600"><User size={8} className="mr-1"/> {kr.assignee}</span>}</div><div className="hidden group-hover/kr:flex items-center space-x-1 mt-1"><button onClick={() => onRequestOp('edit', OKRLevel.KR, path, kr)} className="p-1 text-gray-300"><Edit2 size={12}/></button><button onClick={() => onRequestOp('delete', OKRLevel.KR, path)} className="p-1 text-gray-300 hover:text-red-600"><Trash2 size={12}/></button></div></div>{!compactMode && kr.description && <p className="text-xs text-gray-500 mt-0.5">{kr.description}</p>}</div></div>
            <div className="flex items-center space-x-3"><span className={`text-xs font-bold px-2 py-0.5 rounded ${kr.percentage === 100 ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>{kr.percentage}%</span>{expanded ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}</div>
         </div>
         {expanded && <div className="p-3 bg-white border-t border-gray-100 rounded-b-md"><div className="flex items-center justify-between mb-2"><h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Actions</h4><button onClick={() => onRequestOp('create', OKRLevel.ACTION, path)} className={`text-xs flex items-center ${theme.text} hover:underline`}><Plus size={10} className="mr-1"/> Add Action</button></div><div className="space-y-2">{kr.actions.map((action: any) => <div key={action.id} className="flex items-center justify-between text-sm p-2 hover:bg-gray-50 rounded border border-transparent hover:border-gray-100 group/act"><div className="flex-1 pr-4"><div className="flex items-center"><p className={`text-gray-600 mr-2 ${compactMode ? 'text-xs' : 'text-sm'}`}>{action.description}</p><div className="hidden group-hover/act:flex items-center space-x-1"><button onClick={() => onRequestOp('edit', OKRLevel.ACTION, [...path, action.id], { title: action.description, assignee: action.assignee })} className="p-0.5 text-gray-300"><Edit2 size={10}/></button><button onClick={() => onRequestOp('delete', OKRLevel.ACTION, [...path, action.id])} className="p-0.5 text-gray-300 hover:text-red-600"><Trash2 size={10}/></button></div></div><div className="flex items-center mt-0.5 text-[10px] text-gray-400"><User size={10} className="mr-1" />{action.assignee || 'Unassigned'}</div></div><div className="w-1/3 max-w-[180px] flex items-center space-x-2"><input type="range" min="0" max="100" value={action.percentage} onChange={(e) => onUpdate(action.id, parseInt(e.target.value))} className={`w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer ${theme.rangeAccent}`}/><span className={`w-9 text-right font-mono ${theme.text} font-bold text-xs`}>{action.percentage}%</span></div></div>)}</div></div>}
      </div>
    );
}
