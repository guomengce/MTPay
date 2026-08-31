import type { AgentLoginResult } from '@/api/modules/auth';
import { useAuthStore } from '@/stores/modules/auth';
import { clearLoginChallenge, validLoginResult } from './loginChallenge';
export function completeLogin(result: AgentLoginResult) {
  if (!validLoginResult(result)) throw new Error('Invalid login response');
    useAuthStore().login({
      token: result.token,
      userInfo: {
        id: String(result.id),
        name: result.company_name,
        role: result.portal,
        agentCode: result.agent_code,
        companyName: result.company_name,
        email: result.email,
        phone: result.phone,
        status: result.status,
        statusName: result.status_name,
        activatedAt: result.activated_at,
        lastLoginAt: result.last_login_at,
      },
    });
  clearLoginChallenge();
}
