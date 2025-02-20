interface Env {
  FEISHU_APP_ID: string;
  FEISHU_APP_SECRET: string;
}

interface SearchResult {
  name: string;
  city: string;
  room: string;
  navigation: string;
  schedule: string;
}

async function getTenantAccessToken(env: Env): Promise<string> {
  const response = await fetch('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      app_id: env.FEISHU_APP_ID,
      app_secret: env.FEISHU_APP_SECRET
    })
  });

  const data = await response.json();
  if (data.code === 0) {
    return data.tenant_access_token;
  }
  throw new Error(`获取tenant_access_token失败: ${data.msg}`);
}

export const onRequestPost = async (context: { request: Request, env: Env }) => {
  const { request, env } = context;
  
  try {
    const { phoneNumber } = await request.json();
    const token = await getTenantAccessToken(env);
    
    const response = await fetch('https://open.feishu.cn/open-apis/bitable/v1/apps/bascnCMVMYQBXtsFWQZcXWeznuh/tables/tblGUJIVwlsz0zs3/records/search', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        filter: {
          conjunction: 'and',
          conditions: [
            {
              field_name: '手机号',
              operator: 'is',
              value: [phoneNumber]
            }
          ]
        },
        field_names: ['姓名', '城市', '会议室', '导航信息', '日程安排']
      })
    });

    const data = await response.json();

    if (data.data.items && data.data.items.length > 0) {
      const record = data.data.items[0];
      const result: SearchResult = {
        name: record.fields['姓名'] as string,
        city: record.fields['城市'] as string,
        room: record.fields['会议室'] as string,
        navigation: record.fields['导航信息'] as string,
        schedule: record.fields['日程安排'] as string
      };
      
      return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json' },
        status: 200
      });
    } else {
      return new Response(JSON.stringify({ message: '未找到记录' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 404
      });
    }
  } catch (error) {
    console.error('飞书API调用失败:', error);
    return new Response(JSON.stringify({ message: '查询失败' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    });
  }
};