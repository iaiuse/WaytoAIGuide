import { readBitableData } from './bitable';

async function main() {
    try {
        const tableId = 'tblNjieZ8lfLHX5W';  // 具体表格的ID
        const bitableId = 'Fv2OwmQISi5fOtkIuX2cF0vKnXg';  // 多维表格应用的ID
        const data = await readBitableData(tableId, bitableId);
        console.log('表格数据:', data);
    } catch (error) {
        console.error('获取数据失败:', error);
    }
}

main(); 