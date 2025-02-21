import { AuthService } from '../services/auth-service';

async function handleAuth() {
  const authService = new AuthService();
  
  // 1. 获取授权URL
  const authUrl = authService.getAuthUrl();
  console.log('Please visit this URL to authorize:', authUrl);

  // 2. 用户访问URL并授权后，处理回调
  // 这里模拟回调URL，实际应用中这个URL会由飞书重定向到你的服务器
  const mockCallbackUrl = 'http://localhost:3000/auth/callback?code=123456&state=yourstate';
  const result = await authService.handleCallback(mockCallbackUrl);

  if (result.success && result.refreshToken) {
    console.log('Authorization successful!');
    console.log('Access Token:', result.accessToken);
    console.log('Refresh Token:', result.refreshToken);
    console.log('Expires in:', result.expiresIn, 'seconds');

    // 示例：在token即将过期时刷新
    setTimeout(async () => {
      const refreshResult = await authService.refreshToken(result.refreshToken!);

      if (refreshResult.success) {
        console.log('Token refreshed successfully!');
        console.log('New Access Token:', refreshResult.accessToken);
        console.log('New Refresh Token:', refreshResult.refreshToken);
        console.log('New Expires in:', refreshResult.expiresIn, 'seconds');
      } else {
        console.error('Failed to refresh token:', refreshResult.error);
      }
    }, (result.expiresIn! - 300) * 1000); // 在过期前5分钟刷新

  } else {
    console.error('Authorization failed:', result.error);
  }
}

handleAuth().catch(console.error); 