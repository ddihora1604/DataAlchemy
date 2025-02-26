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
  RadarChart, 
  Radar, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis 
} from 'recharts'

const demoData = {
  trainingProgress: Array.from({ length: 20 }, (_, i) => ({
    epoch: i + 1,
    originalLoss: Math.exp(-i * 0.2) * 0.5 + Math.random() * 0.1,
    syntheticLoss: Math.exp(-i * 0.2) * 0.5 + Math.random() * 0.1,
  })),
  metrics: [
    { metric: 'Accuracy', original: 0.92, synthetic: 0.89 },
    { metric: 'Precision', original: 0.90, synthetic: 0.87 },
    { metric: 'Recall', original: 0.88, synthetic: 0.86 },
    { metric: 'F1 Score', original: 0.89, synthetic: 0.86 },
  ],
  performance: [
    { name: 'Accuracy', original: 92, synthetic: 89 },
    { name: 'Precision', original: 90, synthetic: 87 },
    { name: 'Recall', original: 88, synthetic: 86 },
    { name: 'F1 Score', original: 89, synthetic: 86 },
    { name: 'AUC-ROC', original: 91, synthetic: 88 },
  ]
}

const defaultAxisProps = {
  stroke: 'hsl(var(--muted-foreground))',
  strokeWidth: 1,
  fontSize: 12,
  tickLine: false,
  axisLine: true,
  tickFormatter: (value: number) => value.toString()
}

const defaultPolarAxisProps = {
  stroke: 'hsl(var(--muted-foreground))',
  fontSize: 12,
  tickLine: false
}

export default function MachineLearning() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Machine Learning</h2>
      </div>
      <Tabs defaultValue="training" className="space-y-4">
        <TabsList>
          <TabsTrigger value="training">Model Training</TabsTrigger>
          <TabsTrigger value="evaluation">Model Evaluation</TabsTrigger>
          <TabsTrigger value="comparison">Performance Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="training" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Training Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={demoData.trainingProgress}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis {...defaultAxisProps} dataKey="epoch" />
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
                      dataKey="originalLoss"
                      stroke="hsl(var(--chart-1))"
                      name="Original Data Model"
                    />
                    <Line
                      type="monotone"
                      dataKey="syntheticLoss"
                      stroke="hsl(var(--chart-2))"
                      name="Synthetic Data Model"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evaluation" className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Model Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={demoData.metrics} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis {...defaultAxisProps} type="number" domain={[0, 1]} />
                    <YAxis {...defaultAxisProps} dataKey="metric" type="category" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="original" fill="hsl(var(--chart-1))" name="Original Data" />
                    <Bar dataKey="synthetic" fill="hsl(var(--chart-2))" name="Synthetic Data" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance Radar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%">
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis {...defaultPolarAxisProps} dataKey="name" />
                    <PolarRadiusAxis {...defaultPolarAxisProps} angle={30} domain={[0, 100]} />
                    <Radar
                      name="Original Data"
                      dataKey="original"
                      stroke="hsl(var(--chart-1))"
                      fill="hsl(var(--chart-1))"
                      fillOpacity={0.6}
                      data={demoData.performance}
                    />
                    <Radar
                      name="Synthetic Data"
                      dataKey="synthetic"
                      stroke="hsl(var(--chart-2))"
                      fill="hsl(var(--chart-2))"
                      fillOpacity={0.6}
                      data={demoData.performance}
                    />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Model Performance Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={demoData.performance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis {...defaultAxisProps} dataKey="name" />
                    <YAxis {...defaultAxisProps} domain={[0, 100]} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="original" fill="hsl(var(--chart-1))" name="Original Data" />
                    <Bar dataKey="synthetic" fill="hsl(var(--chart-2))" name="Synthetic Data" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}