import { getAuthUrl } from '@/utils/api';

export function LoginButton() {
  const handleLogin = async () => {
    try {
      const authUrl = await getAuthUrl();
      window.location.href = authUrl;
    } catch (error) {
      console.error('Failed to get auth URL:', error);
    }
  };

  return (
    <button onClick={handleLogin}>
      Login with Feishu
    </button>
  );
} 