import { FeishuResponse, NodeInfo, FeishuConfig } from '../types/feishu';
import { TokenManager } from './token-manager';

export class FeishuClient {
  private baseUrl: string;
  private tokenManager: TokenManager;

  constructor(appId: string, appSecret: string, config?: Partial<FeishuConfig>) {
    this.baseUrl = config?.baseUrl || 'https://open.feishu.cn/open-apis';
    this.tokenManager = new TokenManager(appId, appSecret, this.baseUrl);
  }

  private async getHeaders() {
    const token = await this.tokenManager.getToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  async getNode(token: string, objType: string): Promise<FeishuResponse<NodeInfo>> {
    const url = new URL(`${this.baseUrl}/wiki/v2/spaces/get_node`);
    url.searchParams.append('token', token);
    url.searchParams.append('obj_type', objType);

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: await this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
} 