// 客户端代码，只包含 API 调用接口
const API_BASE = '/api/auth';

export async function getAuthUrl(): Promise<string> {
  const response = await fetch(`${API_BASE}/login`);
  const data = await response.json();
  return data.url;
}

export async function refreshToken(refreshToken: string): Promise<any> {
  const response = await fetch(`${API_BASE}/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });
  return response.json();
} 