import { FeishuClient } from '../clients/feishu-client';


export class WikiService {
  private feishuClient: FeishuClient;

  constructor() {
    if (!process.env.FEISHU_APP_ID || !process.env.FEISHU_APP_SECRET) {
      throw new Error('Missing required environment variables: FEISHU_APP_ID or FEISHU_APP_SECRET');
    }
    this.feishuClient = new FeishuClient(
      process.env.FEISHU_APP_ID,
      process.env.FEISHU_APP_SECRET,
      { baseUrl: process.env.FEISHU_BASE_URL }
    );
  }

  async getWikiNode(token: string) {
    try {
      const response = await this.feishuClient.getNode(token, 'wiki');
      return response.data;
    } catch (error) {
      console.error('Failed to get wiki node:', error);
      throw error;
    }
  }
} 