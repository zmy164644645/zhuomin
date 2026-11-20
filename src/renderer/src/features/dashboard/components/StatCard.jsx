import { Card } from 'antd'

/**
 * 统计卡：一个指标 + 一句补充说明
 * @param {string} tone  default | accent | success | danger
 */
export default function StatCard({ label, value, suffix, hint, tone = 'default' }) {
  return (
    <Card className={`stat-card stat-card--${tone}`} styles={{ body: { padding: '18px 20px' } }}>
      <div className="stat-label">{label}</div>
      <div className="stat-value">
        {value}
        {suffix ? <span className="stat-suffix">{suffix}</span> : null}
      </div>
      <div className="stat-hint">{hint}</div>
    </Card>
  )
}
