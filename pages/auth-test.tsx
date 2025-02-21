import React, { useEffect, useState } from 'react';
import { getAuthUrl } from '@/utils/api';
import { getTokens, saveTokens, clearTokens } from '@/utils/auth';

interface AuthStatus {
  isAuthenticated: boolean;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: string;
  timeLeft?: string;
}

export default function AuthTest() {
  const [status, setStatus] = useState<AuthStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = () => {
    const tokens = getTokens();
    if (tokens) {
      const timeLeft = Math.floor((tokens.expiresAt - Date.now()) / 1000);
      setStatus({
        isAuthenticated: true,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresAt: new Date(tokens.expiresAt).toISOString(),
        timeLeft: `${timeLeft} seconds`
      });
    } else {
      setStatus({ isAuthenticated: false });
    }
    setLoading(false);
  };

  const handleLogin = async () => {
    try {
      const authUrl = await getAuthUrl();
      window.location.href = authUrl;
    } catch (error) {
      console.error('Failed to get auth URL:', error);
    }
  };

  const handleRefresh = async () => {
    try {
      const tokens = getTokens();
      if (!tokens?.refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: tokens.refreshToken })
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const data = await response.json();
      if (data.success) {
        saveTokens(data);
        checkStatus();
      }
    } catch (error) {
      console.error('Failed to refresh token:', error);
      clearTokens();
      checkStatus();
    }
  };

  const handleLogout = () => {
    clearTokens();
    checkStatus();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Auth Test Page</h1>
      
      <div style={{ marginBottom: '20px' }}>
        {!status?.isAuthenticated ? (
          <button onClick={handleLogin}>
            Login with Feishu
          </button>
        ) : (
          <button onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>

      {status?.isAuthenticated ? (
        <div>
          <h2>Current Status:</h2>
          <pre style={{ 
            background: '#f5f5f5', 
            padding: '10px', 
            borderRadius: '4px',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all'
          }}>
            {JSON.stringify(status, null, 2)}
          </pre>
          
          <button onClick={handleRefresh} style={{ marginTop: '10px' }}>
            Refresh Token
          </button>
        </div>
      ) : (
        <div>Not authenticated</div>
      )}
    </div>
  );
} 