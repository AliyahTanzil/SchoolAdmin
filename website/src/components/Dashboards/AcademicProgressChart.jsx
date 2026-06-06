import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

const data = [
  { term: 'Term 1', gpa: 3.1 },
  { term: 'Term 2', gpa: 3.4 },
  { term: 'Term 3', gpa: 3.2 },
  { term: 'Term 4', gpa: 3.8 }
]

export default function AcademicProgressChart() {
  return (
    <div className="dashboard-chart-card">
      <div className="chart-header">
        <h3>Academic Progress</h3>
        <p>GPA Trend across consecutive terms</p>
      </div>
      <div style={{ width: '100%', height: 250 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="term" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              domain={[0, 4]} 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Line 
              type="monotone" 
              dataKey="gpa" 
              stroke="#2563eb" 
              strokeWidth={3} 
              dot={{ r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}