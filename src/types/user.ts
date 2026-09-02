export interface UserInfo {
  id: string;
  name: string;
  role?: string;
  agentCode: string;
  companyName: string;
  email: string;
  phone: string | null;
  status: number;
  statusName: string;
  activatedAt: string | null;
  lastLoginAt: string | null;
  cryptoEnabled: boolean;
}
