interface TokenInfo {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
}

export function saveTokens(tokens: TokenInfo) {
  localStorage.setItem('feishu_tokens', JSON.stringify(tokens));
}

export function getTokens(): TokenInfo | null {
  const tokens = localStorage.getItem('feishu_tokens');
  return tokens ? JSON.parse(tokens) : null;
}

export function clearTokens() {
  localStorage.removeItem('feishu_tokens');
}

export function isTokenExpired(): boolean {
  const tokens = getTokens();
  if (!tokens) return true;
  
  // 提前5分钟认为过期
  return Date.now() > tokens.expiresAt - 5 * 60 * 1000;
} 