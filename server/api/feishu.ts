import { Client } from '@larksuiteoapi/node-sdk';
import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const router = express.Router();

interface TokenInfo {
  token: string;
  expireTime: number;
}

let tokenCache: TokenInfo | null = null;

async function getTenantAccessToken(): Promise<string> {
  const now = Date.now();
  
  // 如果缓存的token还有效，直接返回
  if (tokenCache && now < tokenCache.expireTime) {
    return tokenCache.token;
  }

  try {
    const response = await axios.post('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
      app_id: process.env.FEISHU_APP_ID,
      app_secret: process.env.FEISHU_APP_SECRET
    });

    if (response.data.code === 0) {
      const token = response.data.tenant_access_token;
      const expireTime = now + (response.data.expire - 60) * 1000; // 提前60秒刷新
      
      tokenCache = {
        token,
        expireTime
      };
      
      return token;
    } else {
      throw new Error(`获取tenant_access_token失败: ${response.data.msg}`);
    }
  } catch (error) {
    console.error('获取tenant_access_token失败:', error);
    throw error;
  }
}

const client = new Client({
  appId: process.env.FEISHU_APP_ID as string,
  appSecret: process.env.FEISHU_APP_SECRET as string,
  disableTokenCache: false
});

// 初始化获取token
getTenantAccessToken().catch(console.error);

const FEISHU_APP_TOKEN = process.env.FEISHU_APP_TOKEN;
const FEISHU_TABLE_ID = 'tblGUJIVwlsz0zs3';
const FEISHU_URLS = {
  navigation: process.env.FEISHU_NAVIGATION_URL,
  schedule: process.env.FEISHU_SCHEDULE_URL
};

interface SearchResult {
  /** 报名编号 */
  registrationId: string;
  /** 参与者姓名 */
  name: string;
  /** 手机号码 */
  phoneNumber: string;
  /** 意向参与城市 */
  intendedCity: string;
  /** 微信号 */
  wechatId: string;
  /** 个人背景介绍 */
  background: string;
  /** 是否到场参与 */
  isPresent: boolean;
  /** 提交时间 */
  submitTime: string;
  /** 提交人 */
  submitter: string;
  /** 即梦平台用户ID */
  dreamId: string;
  /** Fanbook平台ID */
  fanbookId: string;
  /** 关联的父记录ID */
  parentRecordId: string;
  /** 签到验证码 */
  checkInCode: string;
  /** 20240727活动中奖状态 */
  prizeStatus20240727: string;
  /** 是否进行分享 */
  hasShared: boolean;
  /** 分享内容 */
  sharedContent: string;
  /** 223活动签到记录 */
  checkIn223: string;
  /** 实际参会人员记录 */
  actualAttendees: string;
}

router.post('/search', async (req, res) => {
  const { phoneNumber } = req.body;
  
  try {
    const response = await client.bitable.v1.appTableRecord.search({
      path: {
        app_token: FEISHU_APP_TOKEN as string,
        table_id: FEISHU_TABLE_ID as string,
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
        field_names: ['编号', '姓名', '手机号', '意向参与城市', '微信号', '详细介绍下自己的背景', '是否到场', '提交时间', '提交人', '即梦UID', 'fanbookid', '父记录', '签到码', '中奖_20240727_001', '是否分享', '分享的内容', '223活动签到表', '实际参会人员']
      }
    });

    if (response.data.items && response.data.items.length > 0) {
      const record = response.data.items[0];
      const result: SearchResult = {
        registrationId: record.fields['编号'] as string,
        name: record.fields['姓名'] as string,
        phoneNumber: record.fields['手机号'] as string,
        intendedCity: record.fields['意向参与城市（以下地址待定，根据每个城市的报名人数确认是否开展，最终地址可能会有更新会在飞书群中同步'] as string,
        wechatId: record.fields['微信号'] as string,
        background: record.fields['详细介绍下自己的背景'] as string,
        isPresent: record.fields['是否到场'] as boolean,
        submitTime: record.fields['提交时间'] as string,
        submitter: record.fields['提交人'] as string,
        dreamId: record.fields['即梦UID'] as string,
        fanbookId: record.fields['fanbookid'] as string,
        parentRecordId: record.fields['父记录'] as string,
        checkInCode: record.fields['签到码'] as string,
        prizeStatus20240727: record.fields['中奖_20240727_001'] as string,
        hasShared: record.fields['是否分享'] as boolean,
        sharedContent: record.fields['分享的内容'] as string,
        checkIn223: record.fields['223活动签到表'] as string,
        actualAttendees: record.fields['实际参会人员'] as string
      };
      res.json(result);
    } else {
      res.status(404).json({ message: '未找到记录' });
    }
  } catch (error) {
    console.error('飞书API调用失败:', error);
    res.status(500).json({ message: '查询失败' });
  }
});

router.get('/content', async (req, res) => {
  try {
    const [navigationRes, scheduleRes] = await Promise.all([
      fetch(FEISHU_URLS.navigation),
      fetch(FEISHU_URLS.schedule)
    ]);

    if (navigationRes.ok && scheduleRes.ok) {
      const navigationText = await navigationRes.text();
      const scheduleText = await scheduleRes.text();
      res.json({
        navigation: navigationText,
        schedule: scheduleText
      });
    } else {
      throw new Error('获取文档内容失败');
    }
  } catch (error) {
    console.error('获取飞书文档内容失败:', error);
    res.status(500).json({ message: '获取文档内容失败' });
  }
});

export default router;