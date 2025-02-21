import type { NextApiRequest, NextApiResponse } from 'next';
import { AuthService } from '@/services/auth-service';

const authService = new AuthService();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const result = await authService.handleCallback(req.url!);
    if (result.success) {
      res.json({
        success: true,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        expiresAt: Date.now() + (result.expiresIn! * 1000)
      });
    } else {
      res.status(401).json({ success: false, error: result.error });
    }
  } catch (error) {
    console.error('Callback error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 