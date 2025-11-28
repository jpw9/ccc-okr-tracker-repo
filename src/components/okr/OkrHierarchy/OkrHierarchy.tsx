
import React from 'react';
import { OkrHierarchyView } from './OkrHierarchy.view';
import { Project, OKRLevel } from '../../../types';

interface Props {
  data: Project;
  onActionUpdate: (stratId: string | number, goalId: string | number, objId: string | number, krId: string | number, actId: string | number, val: number) => void;
  onRequestOp: (op: 'create' | 'edit' | 'delete', level: OKRLevel, pathIds: (string | number)[], currentData?: any) => void;
  isSearching?: boolean;
  globalExpandState?: { action: 'expand' | 'collapse', ts: number } | null;
  theme: any;
  compactMode: boolean;
}

export default function OkrHierarchy(props: Props) {
  return <OkrHierarchyView {...props} />;
}
