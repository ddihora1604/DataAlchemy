"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

const demoData = {
  numericalDistribution: Array.from({ length: 20 }, (_, i) => ({
    value: i * 5,
    originalCount: Math.floor(Math.random() * 100),
    syntheticCount: Math.floor(Math.random() * 100),
  })),
  categoricalDistribution: [
    { name: 'Category A', original: 340, synthetic: 350 },
    { name: 'Category B', original: 230, synthetic: 225 },
    { name: 'Category C', original: 180, synthetic: 185 },
    { name: 'Category D', original: 120, synthetic: 115 },
  ],
  outliers: Array.from({ length: 50 }, (_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    type: Math.random() > 0.1 ? 'normal' : 'outlier'
  })),
  COLORS: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']
}

export default function Insights() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Data Insights</h2>
      </div>
      <Tabs defaultValue="distributions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="distributions">Distributions</TabsTrigger>
          <TabsTrigger value="categorical">Categorical Analysis</TabsTrigger>
          <TabsTrigger value="outliers">Outlier Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="distributions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Numerical Distribution Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={demoData.numericalDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="value" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="originalCount" fill="hsl(var(--chart-1))" name="Original Data" />
                    <Bar dataKey="syntheticCount" fill="hsl(var(--chart-2))" name="Synthetic Data" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categorical" className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Original Data Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={demoData.categoricalDistribution}
                      dataKey="original"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {demoData.categoricalDistribution.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={demoData.COLORS[index % demoData.COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Synthetic Data Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={demoData.categoricalDistribution}
                      dataKey="synthetic"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {demoData.categoricalDistribution.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={demoData.COLORS[index % demoData.COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="outliers">
          <Card>
            <CardHeader>
              <CardTitle>Outlier Detection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={demoData.outliers}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="x" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="scatter"
                      dataKey="y"
                      stroke="none"
                      fill="hsl(var(--chart-1))"
                      name="Data Points"
                      dot={{ r: 4, fill: (entry: any) => entry.type === 'outlier' ? 'hsl(var(--destructive))' : 'hsl(var(--chart-1))' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}