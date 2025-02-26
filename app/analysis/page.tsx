"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  ScatterChart, 
  Scatter 
} from 'recharts'

const demoData = {
  distributions: Array.from({ length: 50 }, (_, i) => ({
    x: i,
    original: Math.sin(i * 0.5) * 10 + 50 + Math.random() * 5,
    synthetic: Math.sin(i * 0.5) * 10 + 50 + Math.random() * 5,
  })),
  statistics: {
    original: {
      mean: 50.2,
      median: 49.8,
      stdDev: 7.3,
      min: 35.4,
      max: 65.1,
      ksTest: 0.95,
      adTest: 0.92,
      chiSquare: 0.89,
      statSimilarity: 0.94,
      privacyScore: 0.88,
      correlationScore: 0.91,
      mlUtility: 0.93,
      dataDiversity: 0.87,
      outlierScore: 0.90
    },
    synthetic: {
      mean: 50.5,
      median: 50.1,
      stdDev: 7.1,
      min: 36.2,
      max: 64.8,
      ksTest: 0.93,
      adTest: 0.90,
      chiSquare: 0.87,
      statSimilarity: 0.92,
      privacyScore: 0.89,
      correlationScore: 0.90,
      mlUtility: 0.91,
      dataDiversity: 0.88,
      outlierScore: 0.89
    }
  },
  correlations: Array.from({ length: 20 }, () => ({
    feature1: Math.random() * 10,
    feature2: Math.random() * 10,
    originalCorr: Math.random(),
    syntheticCorr: Math.random()
  }))
}

const defaultAxisProps = {
  stroke: 'hsl(var(--muted-foreground))',
  strokeWidth: 1,
  fontSize: 12,
  tickLine: false,
  axisLine: true,
  tickFormatter: (value: number) => value.toString()
}

export default function Analysis() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Numerical Analysis</h2>
      </div>
      <Tabs defaultValue="visualizations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="visualizations">Visualizations</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
          <TabsTrigger value="distributions">Distributions</TabsTrigger>
          <TabsTrigger value="correlations">Correlations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="visualizations" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Data Distribution Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={demoData.distributions}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis {...defaultAxisProps} dataKey="x" />
                      <YAxis {...defaultAxisProps} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--background))',
                          border: '1px solid hsl(var(--border))'
                        }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="original" 
                        stroke="hsl(var(--chart-1))" 
                        name="Original Data" 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="synthetic" 
                        stroke="hsl(var(--chart-2))" 
                        name="Synthetic Data" 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Feature Correlation Scatter</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis {...defaultAxisProps} dataKey="feature1" name="Feature 1" />
                      <YAxis {...defaultAxisProps} dataKey="feature2" name="Feature 2" />
                      <Tooltip 
                        cursor={{ strokeDasharray: '3 3' }}
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--background))',
                          border: '1px solid hsl(var(--border))'
                        }}
                      />
                      <Legend />
                      <Scatter 
                        name="Original" 
                        data={demoData.correlations} 
                        fill="hsl(var(--chart-1))" 
                      />
                      <Scatter 
                        name="Synthetic" 
                        data={demoData.correlations} 
                        fill="hsl(var(--chart-2))" 
                      />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="statistics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Original Data Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2">
                  {Object.entries(demoData.statistics.original).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <dt className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</dt>
                      <dd>{typeof value === 'number' ? value.toFixed(2) : value}</dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Synthetic Data Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2">
                  {Object.entries(demoData.statistics.synthetic).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <dt className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</dt>
                      <dd>{typeof value === 'number' ? value.toFixed(2) : value}</dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="distributions">
          <Card>
            <CardHeader>
              <CardTitle>Probability Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={demoData.distributions.slice(0, 10)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis {...defaultAxisProps} dataKey="x" />
                    <YAxis {...defaultAxisProps} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))'
                      }}
                    />
                    <Legend />
                    <Bar 
                      dataKey="original" 
                      fill="hsl(var(--chart-1))" 
                      name="Original Data" 
                    />
                    <Bar 
                      dataKey="synthetic" 
                      fill="hsl(var(--chart-2))" 
                      name="Synthetic Data" 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="correlations">
          <Card>
            <CardHeader>
              <CardTitle>Feature Correlations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={demoData.correlations}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis {...defaultAxisProps} dataKey="feature1" />
                    <YAxis {...defaultAxisProps} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))'
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="originalCorr" 
                      stroke="hsl(var(--chart-1))" 
                      name="Original Correlation" 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="syntheticCorr" 
                      stroke="hsl(var(--chart-2))" 
                      name="Synthetic Correlation" 
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