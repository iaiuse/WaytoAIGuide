import { NextApiRequest, NextApiResponse } from 'next';
import { readBitableData } from '../../../src/bitable';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const { tableId, bitableId } = req.query;
        
        if (typeof tableId !== 'string' || typeof bitableId !== 'string') {
            return res.status(400).json({ error: '无效的参数' });
        }

        const data = await readBitableData(tableId, bitableId);
        res.json(data);
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: '获取数据失败' });
    }
} 