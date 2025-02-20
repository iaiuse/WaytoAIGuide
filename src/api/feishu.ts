export interface SearchResult {
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

export const searchByPhoneNumber = async (phoneNumber: string): Promise<SearchResult | null> => {
  try {
    const response = await fetch('/api/feishu/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phoneNumber })
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('查询失败');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('API调用失败:', error);
    throw new Error('查询失败');
  }
};

export const getFeishuContent = async () => {
  try {
    const response = await fetch('/api/feishu/content');
    if (!response.ok) {
      throw new Error('获取文档内容失败');
    }
    return await response.json();
  } catch (error) {
    console.error('获取飞书文档内容失败:', error);
    throw new Error('获取文档内容失败');
  }
};