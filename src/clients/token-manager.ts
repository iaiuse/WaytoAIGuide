interface TokenResponse {
  code: number;
  msg: string;
  app_access_token: string;
  expire: number;
  tenant_access_token: string;
}

interface UserTokenResponse {
  code: number;
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  refresh_token_expires_in?: number;
  token_type: string;
  scope?: string;
  error?: string;
  error_description?: string;
}

export class TokenManager {
  private baseUrl: string;
  private appId: string;
  private appSecret: string;
  private token: string | null = null;
  private expireTime: number = 0;
  private refreshThreshold: number = 30 * 60; // 30 minutes in seconds

  constructor(appId: string, appSecret: string, baseUrl?: string) {
    this.appId = appId;
    this.appSecret = appSecret;
    this.baseUrl = baseUrl || 'https://open.feishu.cn/open-apis';
  }

  private async fetchNewToken(): Promise<TokenResponse> {
    const response = await fetch(
      `${this.baseUrl}/auth/v3/app_access_token/internal`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({
          app_id: this.appId,
          app_secret: this.appSecret,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data.code !== 0) {
      throw new Error(`API error! code: ${data.code}, message: ${data.msg}`);
    }

    return data;
  }

  private shouldRefreshToken(): boolean {
    if (!this.token) return true;
    
    const now = Math.floor(Date.now() / 1000);
    const timeUntilExpire = this.expireTime - now;
    return timeUntilExpire < this.refreshThreshold;
  }

  async getToken(): Promise<string> {
    if (this.shouldRefreshToken()) {
      const data = await this.fetchNewToken();
      this.token = data.app_access_token;
      this.expireTime = Math.floor(Date.now() / 1000) + data.expire;
    }
    return this.token!;
  }

  /**
   * 获取用户访问令牌
   */
  async getUserAccessToken(code: string, redirectUri: string): Promise<UserTokenResponse> {
    const response = await fetch(
      `${this.baseUrl}/authen/v2/oauth/token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({
          grant_type: 'authorization_code',
          client_id: this.appId,
          client_secret: this.appSecret,
          code: code,
          redirect_uri: redirectUri,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data.code !== 0) {
      throw new Error(`API error! code: ${data.code}, message: ${data.msg}`);
    }

    return data;
  }

  /**
   * 刷新用户访问令牌
   */
  async refreshUserAccessToken(
    refreshToken: string,
    scopes?: string[]
  ): Promise<UserTokenResponse> {
    const response = await fetch(
      `${this.baseUrl}/authen/v2/oauth/token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({
          grant_type: 'refresh_token',
          client_id: this.appId,
          client_secret: this.appSecret,
          refresh_token: refreshToken,
          ...(scopes && { scope: scopes.join(' ') }),
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data.code !== 0) {
      throw new Error(`API error! code: ${data.code}, message: ${data.msg}`);
    }

    return data;
  }
} 