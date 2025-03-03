import type { NextApiRequest, NextApiResponse } from 'next';
import { AuthService } from '@/services/auth-service';

const authService = new AuthService();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 从存储中获取当前的 token
    const currentTokens = await AuthService.getTokens();
    if (!currentTokens) {
      return res.status(401).json({ error: 'No tokens available' });
    }

    const refreshResult = await authService.refreshToken(currentTokens.refreshToken);
    if (refreshResult.success) {
      res.json({
        success: true,
        accessToken: refreshResult.accessToken,
        refreshToken: refreshResult.refreshToken,
        expiresAt: Date.now() + (refreshResult.expiresIn! * 1000)
      });
    } else {
      res.status(401).json({ error: refreshResult.error });
    }
  } catch (error) {
    console.error('Refresh error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 