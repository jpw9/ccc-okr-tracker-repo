import { StrategicInitiative, User, Role } from './types';

export const INITIAL_USERS: User[] = [
  { id: 'u1', name: 'Admin User', firstName: 'Admin', lastName: 'User', login: 'admin_user', groupNo: 'G100', email: 'admin@ccc.net', role: Role.ADMIN, department: 'IT', avatar: 'AD', isActive: true, projectId: 1, createdAt: '2023-01-01' },
  { id: 'u2', name: 'John Doe', firstName: 'John', lastName: 'Doe', login: 'jdoe', groupNo: 'G101', email: 'jdoe@ccc.net', role: Role.MANAGER, department: 'PMO', avatar: 'JD', isActive: true, projectId: 2, createdAt: '2023-01-15' },
  { id: 'u3', name: 'IT Operations', firstName: 'IT', lastName: 'Operations', login: 'itops', groupNo: 'G102', email: 'itops@ccc.net', role: Role.CONTRIBUTOR, department: 'IT', avatar: 'IT', isActive: true, projectId: 1, createdAt: '2023-02-01' },
  { id: 'u4', name: 'HR Team', firstName: 'HR', lastName: 'Team', login: 'hrteam', groupNo: 'G200', email: 'hr@ccc.net', role: Role.CONTRIBUTOR, department: 'HR', avatar: 'HR', isActive: false, projectId: null, createdAt: '2023-03-01' },
  { id: 'u5', name: 'Legal Team', firstName: 'Legal', lastName: 'Team', login: 'legal', groupNo: 'G300', email: 'legal@ccc.net', role: Role.CONTRIBUTOR, department: 'Legal', avatar: 'LG', isActive: true, projectId: 2, createdAt: '2023-04-01' },
  { id: 'u6', name: 'System Admin', firstName: 'System', lastName: 'Admin', login: 'sysadmin', groupNo: 'G100', email: 'sysadmin@ccc.net', role: Role.CONTRIBUTOR, department: 'IT', avatar: 'SA', isActive: true, projectId: null, createdAt: '2023-05-01' },
  { id: 'u7', name: 'Dev Team', firstName: 'Dev', lastName: 'Team', login: 'dev', groupNo: 'G101', email: 'dev@ccc.net', role: Role.CONTRIBUTOR, department: 'Engineering', avatar: 'DT', isActive: true, projectId: 1, createdAt: '2023-06-01' },
  { id: 'u8', name: 'Procurement', firstName: 'Procurement', lastName: 'Team', login: 'procurement', groupNo: 'G400', email: 'procurement@ccc.net', role: Role.CONTRIBUTOR, department: 'Supply Chain', avatar: 'PR', isActive: true, projectId: null, createdAt: '2023-07-01' },
  { id: 'u9', name: 'Telecom Team', firstName: 'Telecom', lastName: 'Team', login: 'telecom', groupNo: 'G102', email: 'telecom@ccc.net', role: Role.CONTRIBUTOR, department: 'IT', avatar: 'TC', isActive: true, projectId: 2, createdAt: '2023-08-01' },
  { id: 'u10', name: 'L&D Team', firstName: 'L&D', lastName: 'Team', login: 'learning', groupNo: 'G200', email: 'learning@ccc.net', role: Role.CONTRIBUTOR, department: 'HR', avatar: 'LD', isActive: true, projectId: null, createdAt: '2023-09-01' },
  { id: 'u11', name: 'Security Ops', firstName: 'Security', lastName: 'Ops', login: 'secops', groupNo: 'G300', email: 'secops@ccc.net', role: Role.CONTRIBUTOR, department: 'Security', avatar: 'SO', isActive: true, projectId: 1, createdAt: '2023-10-01' },
];

// Data now lives in PostgreSQL.
export const INITIAL_DATA: StrategicInitiative[] = [];