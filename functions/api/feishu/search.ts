import { Client } from '@larksuiteoapi/node-sdk';

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

export const onRequestPost = async (context: { request: Request, env: Env }) => {
  const { request, env } = context;
  
  try {
    const { phoneNumber } = await request.json();
    
    const client = new Client({
      appId: env.FEISHU_APP_ID,
      appSecret: env.FEISHU_APP_SECRET,
      disableTokenCache: true
    });

    const response = await client.bitable.v1.appTableRecord.search({
      path: {
        app_token: 'bascnCMVMYQBXtsFWQZcXWeznuh',
        table_id: 'tblGUJIVwlsz0zs3', // 替换为实际的飞书多维表格 table_id
      },
      data: {
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
      }
    });

    if (response.data.items && response.data.items.length > 0) {
      const record = response.data.items[0];
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