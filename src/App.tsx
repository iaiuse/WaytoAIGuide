import { useState } from 'react'
import { Input, Button, Card, Space, message, Descriptions, Typography } from 'antd'
import { searchByPhoneNumber } from './api/feishu'
import './App.css'

const { Title, Text } = Typography

interface SearchResult {
  name?: string
  city?: string
  room?: string
  navigation?: string
  schedule?: string
}

function App() {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null)

  const handleSearch = async () => {
    if (!/^1[3-9]\d{9}$/.test(phoneNumber)) {
      message.error('哎呀~请输入正确的船票编码呢 (。・ω・。)')
      return
    }

    setLoading(true)
    setHasSearched(true)
    try {
      const result = await searchByPhoneNumber(phoneNumber)
      if (result) {
        setSearchResult(result)
      } else {
        setSearchResult(null)
        message.warning('抱歉，没有找到对应的船票信息 (´;ω;｀)')
      }
    } catch (error) {
      console.error('查询失败:', error)
      message.error('呜呜~查询失败了，要不要稍后再试试看？ (｡•́︿•̀｡)')
      setSearchResult(null)
    } finally {
      setLoading(false)
    }
  }

  const resetSearch = () => {
    setHasSearched(false)
    setSearchResult(null)
    setPhoneNumber('')
  }

  return (
    <div className="app-container">
      <div className="content-wrapper">
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Card 
            className={`search-card ${hasSearched ? 'searched' : ''}`}
            title={<Title level={3} style={{ color: '#fff', margin: 0 }}>欢迎来到AI宇宙中心 🚀</Title>}
          >
            {!hasSearched ? (
              <Space direction="vertical" style={{ width: '100%' }}>
                <Input
                  placeholder="请输入你的船票编码（手机号）"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  style={{ width: '100%' }}
                  size="large"
                />
                <Button
                  type="primary"
                  onClick={handleSearch}
                  loading={loading}
                  style={{ width: '100%' }}
                  size="large"
                >
                  启动传送门 ✨
                </Button>
              </Space>
            ) : searchResult ? (
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div className="welcome-message">
                  <Text style={{ fontSize: '1.2em', color: '#fff' }}>
                    欢迎你，{searchResult.name}! 准备好探索AI宇宙了吗？ ٩(◕‿◕｡)۶
                  </Text>
                </div>
                <Descriptions bordered column={1} className="result-descriptions">
                  <Descriptions.Item label="降落地点">{searchResult.city}</Descriptions.Item>
                  <Descriptions.Item label="空间站">{searchResult.room}</Descriptions.Item>
                  <Descriptions.Item label="星际导航">{searchResult.navigation}</Descriptions.Item>
                  <Descriptions.Item label="探索日程">
                    {searchResult.schedule?.split('\n').map((line, index) => (
                      <div key={index}>{line}</div>
                    ))}
                  </Descriptions.Item>
                </Descriptions>
                <Button type="link" onClick={resetSearch} style={{ color: '#fff' }}>
                  重新输入船票 ↺
                </Button>
              </Space>
            ) : (
              <div className="not-found-message">
                <Text style={{ fontSize: '1.2em', color: '#fff' }}>
                  抱歉，这艘飞船似乎还未注册 (´;ω;｀)
                </Text>
                <Button type="link" onClick={resetSearch} style={{ color: '#fff', marginTop: '16px' }}>
                  重新输入船票 ↺
                </Button>
              </div>
            )}
          </Card>
        </Space>
      </div>
      <div className="footer">
        <Text style={{ color: 'rgba(255, 255, 255, 0.45)', fontSize: '0.9em' }}>
          大雨 & CT 基于 Trea 构建
        </Text>
      </div>
    </div>
  )
}

export default App
