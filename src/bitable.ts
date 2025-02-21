import * as lark from '@larksuiteoapi/node-sdk';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

// 检查必要的环境变量
if (!process.env.FEISHU_APP_ID || !process.env.FEISHU_APP_SECRET) {
    throw new Error('请在 .env 文件中设置 FEISHU_APP_ID 和 FEISHU_APP_SECRET');
}

// 创建飞书客户端
const client = new lark.Client({
    appId: process.env.FEISHU_APP_ID,
    appSecret: process.env.FEISHU_APP_SECRET,
    appType: lark.AppType.SelfBuild,
});

// 读取指定 table 的数据
async function readBitableData(tableId: string, bitableId: string) {
    try {
        // 获取表格记录
        const response = await client.bitable.appTableRecord.list({
            path: {
                table_id: tableId,
                app_token: bitableId
            },
            params: {
                page_size: 100  // 每页数据条数，最大100
            }
        });

        return response.data;
    } catch (error) {
        console.error('读取表格数据失败:', error);
        throw error;
    }
}

// 导出函数
export {
    readBitableData
}; 