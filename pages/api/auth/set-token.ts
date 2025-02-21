import type { NextApiRequest, NextApiResponse } from 'next';
import { AuthService } from '@/services/auth-service';

// 添加一个简单的密钥验证，防止随意访问
const API_SECRET = 'your-api-secret-key';  // 建议使用环境变量

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 验证请求中的密钥
  const authHeader = req.headers.authorization;
  if (!authHeader || `Bearer ${API_SECRET}` !== authHeader) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { accessToken, refreshToken, expiresIn } = req.body;
    
    if (!accessToken || !refreshToken || !expiresIn) {
      return res.status(400).json({ error: 'Missing required token information' });
    }

    // 存储 token 信息
    // 这里可以使用 Redis 或其他存储方式，这里简单起见使用内存存储
    AuthService.setTokens({
      accessToken,
      refreshToken,
      expiresAt: Date.now() + (expiresIn * 1000)
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Set token error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 