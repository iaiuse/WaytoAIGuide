interface AuthConfig {
  clientId: string;
  redirectUri: string;
  scopes: string[];
}

export class AuthManager {
  private baseUrl: string = 'https://accounts.feishu.cn/open-apis';
  private config: AuthConfig;

  constructor(config: AuthConfig) {
    this.config = config;
  }

  // 添加 getter 以访问 redirectUri
  get redirectUri(): string {
    return this.config.redirectUri;
  }

  /**
   * 生成授权URL
   * @param state 用于防止CSRF攻击的随机字符串
   */
  getAuthorizationUrl(state: string): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      scope: this.config.scopes.join(' '),
      state: state,
    });

    return `${this.baseUrl}/authen/v1/authorize?${params.toString()}`;
  }

  /**
   * 验证回调URL中的state参数
   */
  validateCallback(callbackState: string, originalState: string): boolean {
    return callbackState === originalState;
  }

  /**
   * 从URL中提取授权码
   */
  static extractCodeFromUrl(url: string): string | null {
    const urlObj = new URL(url);
    return urlObj.searchParams.get('code');
  }

  /**
   * 检查是否授权被拒绝
   */
  static isAuthorizationDenied(url: string): boolean {
    const urlObj = new URL(url);
    return urlObj.searchParams.get('error') === 'access_denied';
  }
} 