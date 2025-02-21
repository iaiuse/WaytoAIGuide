import { AuthManager } from '../clients/auth-manager';
import { TokenManager } from '../clients/token-manager';

interface AuthResult {
  success: boolean;
  accessToken?: string;
  refreshToken?: string;
  error?: string;
  expiresIn?: number;
}

interface FeishuConfig {
  appId: string;
  appSecret: string;
  redirectUri: string;
  baseUrl: string;
}

export class AuthService {
  private authManager: AuthManager;
  private tokenManager: TokenManager;
  private state: string;

  constructor() {
    const config: FeishuConfig = {
      appId: process.env.FEISHU_APP_ID!,
      appSecret: process.env.FEISHU_APP_SECRET!,
      redirectUri: process.env.FEISHU_REDIRECT_URI!,
      baseUrl: process.env.FEISHU_BASE_URL || 'https://open.feishu.cn/open-apis'
    };

    if (!config.appId || !config.appSecret || !config.redirectUri) {
      throw new Error('Missing required Feishu configuration');
    }

    this.authManager = new AuthManager({
      clientId: config.appId,
      redirectUri: config.redirectUri,
      scopes: [
        'contact:contact:readonly',  // 示例权限
        'bitable:app:readonly',      // 示例权限
        'offline_access'  // 添加此权限以获取refresh_token
      ]
    });
    
    this.tokenManager = new TokenManager(
      config.appId,
      config.appSecret,
      config.baseUrl
    );
    
    // 生成随机state
    this.state = this.generateState();
  }

  private generateState(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  /**
   * 获取授权URL
   */
  getAuthUrl(): string {
    return this.authManager.getAuthorizationUrl(this.state);
  }

  /**
   * 刷新访问令牌
   */
  async refreshToken(
    refreshToken: string,
    scopes?: string[]
  ): Promise<AuthResult> {
    try {
      const tokenResponse = await this.tokenManager.refreshUserAccessToken(
        refreshToken,
        scopes
      );

      return {
        success: true,
        accessToken: tokenResponse.access_token,
        refreshToken: tokenResponse.refresh_token,
        expiresIn: tokenResponse.expires_in,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to refresh token',
      };
    }
  }

  /**
   * 处理授权回调
   */
  async handleCallback(callbackUrl: string): Promise<AuthResult> {
    if (AuthManager.isAuthorizationDenied(callbackUrl)) {
      return { success: false, error: 'Authorization denied by user' };
    }

    const urlObj = new URL(callbackUrl);
    const state = urlObj.searchParams.get('state');
    const code = urlObj.searchParams.get('code');

    if (!state || !this.authManager.validateCallback(state, this.state)) {
      return { success: false, error: 'Invalid state parameter' };
    }

    if (!code) {
      return { success: false, error: 'No authorization code received' };
    }

    try {
      const tokenResponse = await this.tokenManager.getUserAccessToken(
        code,
        this.authManager.redirectUri
      );

      return {
        success: true,
        accessToken: tokenResponse.access_token,
        refreshToken: tokenResponse.refresh_token,
        expiresIn: tokenResponse.expires_in,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get access token',
      };
    }
  }
} 