"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

// Enhanced price data with multiple property types
const priceData = [
  { month: "Jan", apartment: 45000, house: 65000, land: 32000 },
  { month: "Feb", price: 47000, apartment: 46000, house: 67000, land: 33500 },
  { month: "Mar", price: 46500, apartment: 47500, house: 66500, land: 33000 },
  { month: "Apr", price: 48000, apartment: 49000, house: 68000, land: 34000 },
  { month: "May", price: 49500, apartment: 50500, house: 70000, land: 35500 },
  { month: "Jun", price: 51000, apartment: 52000, house: 72000, land: 36000 },
]

// Custom tooltip component for better display
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border rounded shadow-sm">
        <p className="font-medium text-gray-900">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={`item-${index}`} style={{ color: entry.color }}>
            {entry.name}: ৳{entry.value.toLocaleString()} per sqft
          </p>
        ))}
      </div>
    )
  }

  return null
}

export default function PriceTrendChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={priceData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="month" 
          tick={{ fill: '#6b7280' }}
          axisLine={{ stroke: '#e5e7eb' }}
        />
        <YAxis 
          tick={{ fill: '#6b7280' }}
          axisLine={{ stroke: '#e5e7eb' }}
          tickFormatter={(value) => `৳${value}`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line
          type="monotone"
          dataKey="apartment"
          name="Apartment"
          stroke="#0088FE"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="house"
          name="House"
          stroke="#00C49F"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="land"
          name="Land"
          stroke="#FFBB28"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}