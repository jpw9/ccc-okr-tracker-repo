export enum OKRLevel {
  PROJECT = 'Project',
  INITIATIVE = 'Initiative',
  GOAL = 'Goal',
  OBJECTIVE = 'Objective',
  KR = 'Key Result',
  ACTION = 'Action'
}

export enum Role {
  ADMIN = 'Admin',
  MANAGER = 'Manager',
  CONTRIBUTOR = 'Contributor',
  VIEWER = 'Viewer'
}

export interface User {
  id: string | number;
  name: string;
  email: string;
  role: Role;
  department?: string;
  avatar?: string;
}

export interface BaseEntity {
  id: string | number;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface ActionItem extends BaseEntity {
  description: string;
  assignee: string;
  percentage: number;
}

export interface KeyResult extends BaseEntity {
  title: string;
  description?: string;
  actions: ActionItem[];
  assignee?: string;
  expanded?: boolean;
  percentage?: number;
}

export interface Objective extends BaseEntity {
  title: string;
  description?: string;
  keyResults: KeyResult[];
  assignee?: string;
  expanded?: boolean;
  percentage?: number;
}

export interface Goal extends BaseEntity {
  title: string;
  description?: string;
  objectives: Objective[];
  assignee?: string;
  expanded?: boolean;
  percentage?: number;
}

export interface StrategicInitiative extends BaseEntity {
  title: string;
  description: string;
  goals: Goal[];
  assignee?: string;
  expanded?: boolean;
  percentage?: number;
}

export interface Project extends BaseEntity {
  title: string;
  description: string;
  initiatives: StrategicInitiative[];
  percentage?: number;
}

export interface DbSchema {
  schema: string;
}

export type IdPath = (string | number)[];