import { useState } from 'react';
import { handleBitableRequest } from './api/bitable';

function App() {
  const [data, setData] = useState<any>(null);

  const fetchData = async () => {
    try {
      const tableId = 'tblNjieZ8lfLHX5W';
      const bitableId = 'Fv2OwmQISi5fOtkIuX2cF0vKnXg';
      const result = await handleBitableRequest(tableId, bitableId);
      setData(result?.data || null);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <button onClick={fetchData}>获取数据</button>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}

export default App; 