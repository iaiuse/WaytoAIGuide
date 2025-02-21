import type { NextApiRequest, NextApiResponse } from 'next';
import { AuthService } from '@/services/auth-service';

const authService = new AuthService();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const authUrl = authService.getAuthUrl();
    res.json({ url: authUrl });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 