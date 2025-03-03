import { useState } from 'react';

export default function DebugSetToken() {
  const [formData, setFormData] = useState({
    accessToken: '',
    refreshToken: '',
    expiresIn: '7200',
    apiSecret: 'your-api-secret-key',
    appId: process.env.NEXT_PUBLIC_FEISHU_APP_ID || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/set-token', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${formData.apiSecret}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          accessToken: formData.accessToken,
          refreshToken: formData.refreshToken,
          expiresIn: parseInt(formData.expiresIn)
        })
      });

      const result = await response.json();
      alert(result.success ? '设置成功！' : '设置失败！');
    } catch (error) {
      console.error('Error:', error);
      alert('设置失败！');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Debug: Set Token</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div>
          <label>Access Token:</label>
          <input
            type="text"
            value={formData.accessToken}
            onChange={e => setFormData(prev => ({ ...prev, accessToken: e.target.value }))}
            style={{ width: '100%', marginTop: '5px' }}
          />
        </div>
        <div>
          <label>Refresh Token:</label>
          <input
            type="text"
            value={formData.refreshToken}
            onChange={e => setFormData(prev => ({ ...prev, refreshToken: e.target.value }))}
            style={{ width: '100%', marginTop: '5px' }}
          />
        </div>
        <div>
          <label>Expires In (seconds):</label>
          <input
            type="number"
            value={formData.expiresIn}
            onChange={e => setFormData(prev => ({ ...prev, expiresIn: e.target.value }))}
            style={{ width: '100%', marginTop: '5px' }}
          />
        </div>
        <div>
          <label>API Secret:</label>
          <input
            type="password"
            value={formData.apiSecret}
            onChange={e => setFormData(prev => ({ ...prev, apiSecret: e.target.value }))}
            style={{ width: '100%', marginTop: '5px' }}
          />
        </div>
        <button type="submit" style={{ marginTop: '10px', padding: '10px' }}>
          设置 Token
        </button>
      </form>
    </div>
  );
} 