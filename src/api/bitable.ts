import { readBitableData } from '../bitable';

export async function handleBitableRequest(tableId: string, bitableId: string) {
    try {
        if (!tableId || !bitableId) {
            throw new Error('无效的参数');
        }

        const data = await readBitableData(tableId, bitableId);
        return { data };
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
} 