
import { StrategicInitiative, User, Role } from './types';

export const INITIAL_USERS: User[] = [
  { id: 'u1', name: 'Admin User', email: 'admin@ccc.net', role: Role.ADMIN, department: 'IT', avatar: 'AD' },
  { id: 'u2', name: 'John Doe', email: 'jdoe@ccc.net', role: Role.MANAGER, department: 'PMO', avatar: 'JD' },
  { id: 'u3', name: 'IT Operations', email: 'itops@ccc.net', role: Role.CONTRIBUTOR, department: 'IT', avatar: 'IT' },
  { id: 'u4', name: 'HR Team', email: 'hr@ccc.net', role: Role.CONTRIBUTOR, department: 'HR', avatar: 'HR' },
  { id: 'u5', name: 'Legal Team', email: 'legal@ccc.net', role: Role.CONTRIBUTOR, department: 'Legal', avatar: 'LG' },
  { id: 'u6', name: 'System Admin', email: 'sysadmin@ccc.net', role: Role.CONTRIBUTOR, department: 'IT', avatar: 'SA' },
  { id: 'u7', name: 'Dev Team', email: 'dev@ccc.net', role: Role.CONTRIBUTOR, department: 'Engineering', avatar: 'DT' },
  { id: 'u8', name: 'Procurement', email: 'procurement@ccc.net', role: Role.CONTRIBUTOR, department: 'Supply Chain', avatar: 'PR' },
  { id: 'u9', name: 'Telecom Team', email: 'telecom@ccc.net', role: Role.CONTRIBUTOR, department: 'IT', avatar: 'TC' },
  { id: 'u10', name: 'L&D Team', email: 'learning@ccc.net', role: Role.CONTRIBUTOR, department: 'HR', avatar: 'LD' },
  { id: 'u11', name: 'Security Ops', email: 'secops@ccc.net', role: Role.CONTRIBUTOR, department: 'Security', avatar: 'SO' },
];

// Data now lives in PostgreSQL.
export const INITIAL_DATA: StrategicInitiative[] = [];
