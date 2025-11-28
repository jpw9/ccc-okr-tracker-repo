import { useState, useEffect } from 'react';
import { INITIAL_USERS } from '../constants';
import { Project, User, OKRLevel } from '../types';

const API_BASE_URL = 'http://localhost:8080/api/v1/okr';

export const useOkrData = () => {
  const [data, setData] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [isLoading, setIsLoading] = useState(true);
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [isDbEmpty, setIsDbEmpty] = useState(false);

  // Helper to ensure stable ordering by ID
  const sortDataRecursive = (items: Project[]): Project[] => {
    const sorter = (a: { id: string | number }, b: { id: string | number }) => {
        const idA = a.id;
        const idB = b.id;
        if (typeof idA === 'number' && typeof idB === 'number') return idA - idB;
        if (typeof idA === typeof idB) {
            const numA = parseFloat(String(idA));
            const numB = parseFloat(String(idB));
            if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
            return String(idA).localeCompare(String(idB), undefined, { numeric: true, sensitivity: 'base' });
        }
        return typeof idA === 'number' ? -1 : 1;
    };
    
    return [...items].sort(sorter).map(proj => ({
        ...proj,
        initiatives: [...proj.initiatives].sort(sorter).map(strat => ({
            ...strat,
            goals: [...strat.goals].sort(sorter).map(goal => ({
                ...goal,
                objectives: [...goal.objectives].sort(sorter).map(obj => ({
                    ...obj,
                    keyResults: [...obj.keyResults].sort(sorter).map(kr => ({
                        ...kr,
                        actions: [...kr.actions].sort(sorter)
                    }))
                }))
            }))
        }))
    }));
  };

  const calculateRollups = (data: Project[]): Project[] => {
    return data.map(proj => {
        const updatedInitiatives = proj.initiatives.map(strat => {
            const updatedGoals = strat.goals.map(goal => {
                const updatedObjectives = goal.objectives.map(obj => {
                    const updatedKRs = obj.keyResults.map(kr => {
                        const totalActions = kr.actions.length;
                        if (totalActions === 0) return { ...kr };
                        const totalPct = kr.actions.reduce((sum, act) => sum + act.percentage, 0);
                        return { ...kr, percentage: Math.round(totalPct / totalActions) };
                    });
                    const totalKRs = updatedKRs.length;
                    if (totalKRs === 0) return { ...obj, keyResults: updatedKRs };
                    const objPct = updatedKRs.reduce((sum, kr) => sum + (kr.percentage || 0), 0) / totalKRs;
                    return { ...obj, keyResults: updatedKRs, percentage: Math.round(objPct) };
                });
                const totalObjs = updatedObjectives.length;
                if (totalObjs === 0) return { ...goal, objectives: updatedObjectives };
                const goalPct = updatedObjectives.reduce((sum, obj) => sum + (obj.percentage || 0), 0) / totalObjs;
                return { ...goal, objectives: updatedObjectives, percentage: Math.round(goalPct) };
            });
            const totalGoals = updatedGoals.length;
            if (totalGoals === 0) return { ...strat, goals: updatedGoals };
            const stratPct = updatedGoals.reduce((sum, g) => sum + (g.percentage || 0), 0) / totalGoals;
            return { ...strat, goals: updatedGoals, percentage: Math.round(stratPct) };
        });
        const totalInits = updatedInitiatives.length;
        if (totalInits === 0) return { ...proj, initiatives: updatedInitiatives };
        const projPct = updatedInitiatives.reduce((sum, i) => sum + (i.percentage || 0), 0) / totalInits;
        return { ...proj, initiatives: updatedInitiatives, percentage: Math.round(projPct) };
    });
  };

  const generateId = (prefix: string) => `${prefix}-${Date.now()}`;

  const loadData = async () => {
    setIsLoading(true);
    setConnectionError(null);
    setIsDbEmpty(false);
    try {
      const response = await fetch(`${API_BASE_URL}/projects`);
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      
      const result = await response.json();
      setIsBackendConnected(true);
      
      if (Array.isArray(result) && result.length > 0) {
        setData(sortDataRecursive(calculateRollups(result)));
      } else {
        setIsDbEmpty(true);
        setData([]); 
      }
    } catch (error: any) {
      console.warn("Backend fail", error);
      setConnectionError(error.message);
      setIsBackendConnected(false);
      setData([]); 
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const prepareDataForSave = (data: Project[]) => {
      const isTempId = (id: string | number) => typeof id === 'string' && (String(id).startsWith('proj-') || String(id).startsWith('strat-') || String(id).startsWith('goal-') || String(id).startsWith('obj-') || String(id).startsWith('kr-') || String(id).startsWith('act-'));
      
      return data.map(p => ({
          ...p,
          id: isTempId(p.id) ? null : p.id,
          initiatives: p.initiatives.map(s => ({
              ...s,
              id: isTempId(s.id) ? null : s.id,
              goals: s.goals.map(g => ({
                  ...g,
                  id: isTempId(g.id) ? null : g.id,
                  objectives: g.objectives.map(o => ({
                      ...o,
                      id: isTempId(o.id) ? null : o.id,
                      keyResults: o.keyResults.map(k => ({
                          ...k,
                          id: isTempId(k.id) ? null : k.id,
                          actions: k.actions.map(a => ({
                              ...a,
                              id: isTempId(a.id) ? null : a.id
                          }))
                      }))
                  }))
              }))
          }))
      }));
  };

  const saveData = async () => {
    setSaveStatus('saving');
    try {
      const sortedData = sortDataRecursive(data);
      const payload = prepareDataForSave(sortedData);
      
      const response = await fetch(`${API_BASE_URL}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error('Failed to save');
      
      const savedData = await response.json();
      setData(sortDataRecursive(calculateRollups(savedData)));
      
      setSaveStatus('success');
      setIsDbEmpty(false);
      setIsBackendConnected(true);
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error("Save failed", error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const updateActionPercentage = (projId: string | number, stratId: string | number, goalId: string | number, objId: string | number, krId: string | number, actionId: string | number, newPct: number) => {
    setData(prev => {
      const newData = prev.map(p => String(p.id) !== String(projId) ? p : {
          ...p, initiatives: p.initiatives.map(s => String(s.id) !== String(stratId) ? s : {
            ...s, goals: s.goals.map(g => String(g.id) !== String(goalId) ? g : {
              ...g, objectives: g.objectives.map(o => String(o.id) !== String(objId) ? o : {
                ...o, keyResults: o.keyResults.map(k => String(k.id) !== String(krId) ? k : {
                  ...k, actions: k.actions.map(a => String(a.id) !== String(actionId) ? a : { ...a, percentage: newPct })
                })
              })
            })
          })
      });
      return sortDataRecursive(calculateRollups(newData));
    });
  };

  const crudOperation = (mode: 'create' | 'edit', level: OKRLevel, pathIds: (string | number)[], formData: any) => {
    setData(prev => {
      let newData = [...prev];
      if (mode === 'create') {
        if (level === OKRLevel.PROJECT) {
             newData.push({ id: generateId('proj'), title: formData.title, description: formData.description, initiatives: [], percentage: 0 });
        } else {
             newData = newData.map(p => {
                if(String(p.id) !== String(pathIds[0])) return p;
                if(level === OKRLevel.INITIATIVE) return {...p, initiatives: [...p.initiatives, { id: generateId('strat'), title: formData.title, description: formData.description, goals: [], percentage: 0 }]};
                
                return {...p, initiatives: p.initiatives.map(s => {
                    if(String(s.id) !== String(pathIds[1])) return s;
                    if(level === OKRLevel.GOAL) return {...s, goals: [...s.goals, { id: generateId('goal'), title: formData.title, description: formData.description, objectives: [], percentage: 0 }]};
                    
                    return {...s, goals: s.goals.map(g => {
                        if(String(g.id) !== String(pathIds[2])) return g;
                        if(level === OKRLevel.OBJECTIVE) return {...g, objectives: [...g.objectives, { id: generateId('obj'), title: formData.title, description: formData.description, assignee: formData.assignee, keyResults: [], percentage: 0 }]};
                        
                        return {...g, objectives: g.objectives.map(o => {
                            if(String(o.id) !== String(pathIds[3])) return o;
                            if(level === OKRLevel.KR) return {...o, keyResults: [...o.keyResults, { id: generateId('kr'), title: formData.title, description: formData.description, assignee: formData.assignee, actions: [], percentage: 0 }]};
                            
                            return {...o, keyResults: o.keyResults.map(k => {
                                if(String(k.id) !== String(pathIds[4])) return k;
                                if(level === OKRLevel.ACTION) return {...k, actions: [...k.actions, { id: generateId('act'), description: formData.title, assignee: formData.assignee, percentage: 0 }]};
                                return k;
                            })}
                        })}
                    })}
                })}
             });
        }
      } else if (mode === 'edit') {
         newData = newData.map(p => {
            if(String(p.id) !== String(pathIds[0])) return p;
            if(level === OKRLevel.PROJECT) return {...p, title: formData.title, description: formData.description};

            return {...p, initiatives: p.initiatives.map(s => {
                if(String(s.id) !== String(pathIds[1])) return s;
                if(level === OKRLevel.INITIATIVE) return {...s, title: formData.title, description: formData.description};

                return {...s, goals: s.goals.map(g => {
                    if(String(g.id) !== String(pathIds[2])) return g;
                    if(level === OKRLevel.GOAL) return {...g, title: formData.title, description: formData.description};

                    return {...g, objectives: g.objectives.map(o => {
                        if(String(o.id) !== String(pathIds[3])) return o;
                        if(level === OKRLevel.OBJECTIVE) return {...o, title: formData.title, description: formData.description, assignee: formData.assignee};

                        return {...o, keyResults: o.keyResults.map(k => {
                            if(String(k.id) !== String(pathIds[4])) return k;
                            if(level === OKRLevel.KR) return {...k, title: formData.title, description: formData.description, assignee: formData.assignee};
                            return {...k, actions: k.actions.map(a => String(a.id) !== String(pathIds[5]) ? a : {...a, description: formData.title, assignee: formData.assignee})}
                        })}
                    })}
                })}
            })}
         });
      }
      return sortDataRecursive(calculateRollups(newData));
    });
  };

  const deleteOperation = (level: OKRLevel, pathIds: (string | number)[]) => {
      setData(prev => {
          let newData = [...prev];
          if(level === OKRLevel.PROJECT) {
              newData = newData.filter(p => String(p.id) !== String(pathIds[0]));
          } else {
              newData = newData.map(p => {
                  if(String(p.id) !== String(pathIds[0])) return p;
                  
                  return {...p, initiatives: p.initiatives.filter(s => {
                      if(level === OKRLevel.INITIATIVE && String(s.id) === String(pathIds[1])) return false;
                      if(String(s.id) !== String(pathIds[1])) return true;

                      s.goals = s.goals.filter(g => {
                          if(level === OKRLevel.GOAL && String(g.id) === String(pathIds[2])) return false;
                          if(String(g.id) !== String(pathIds[2])) return true;

                          g.objectives = g.objectives.filter(o => {
                              if(level === OKRLevel.OBJECTIVE && String(o.id) === String(pathIds[3])) return false;
                              if(String(o.id) !== String(pathIds[3])) return true;

                              o.keyResults = o.keyResults.filter(k => {
                                  if(level === OKRLevel.KR && String(k.id) === String(pathIds[4])) return false;
                                  if(String(k.id) !== String(pathIds[4])) return true;
                                  if(level === OKRLevel.ACTION) k.actions = k.actions.filter(a => String(a.id) !== String(pathIds[5]));
                                  return true;
                              });
                              return true;
                          });
                          return true;
                      });
                      return true;
                  })}
              });
          }
          return sortDataRecursive(calculateRollups(newData));
      });
  };

  return {
    data,
    users,
    setUsers,
    isLoading,
    isBackendConnected,
    isDbEmpty,
    connectionError,
    saveStatus,
    loadData,
    saveData,
    updateActionPercentage,
    crudOperation,
    deleteOperation,
    API_BASE_URL
  };
};