interface Env {
  FEISHU_NAVIGATION_URL: string;
  FEISHU_SCHEDULE_URL: string;
}

export const onRequestGet = async (context: { env: Env }) => {
  const { env } = context;
  
  try {
    const [navigationRes, scheduleRes] = await Promise.all([
      fetch(env.FEISHU_NAVIGATION_URL),
      fetch(env.FEISHU_SCHEDULE_URL)
    ]);

    if (navigationRes.ok && scheduleRes.ok) {
      const navigationText = await navigationRes.text();
      const scheduleText = await scheduleRes.text();
      
      return new Response(JSON.stringify({
        navigation: navigationText,
        schedule: scheduleText
      }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200
      });
    } else {
      throw new Error('获取文档内容失败');
    }
  } catch (error) {
    console.error('获取飞书文档内容失败:', error);
    return new Response(JSON.stringify({ message: '获取文档内容失败' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    });
  }
};