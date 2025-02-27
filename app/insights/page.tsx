"use client"

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'
import { useData } from "@/contexts/data-context"

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
  const { dataset, generatedData } = useData()
  const [visualizations, setVisualizations] = useState({
    distributions: '',
    correlations: '',
    bic_aic: ''
  });

  useEffect(() => {
    // Check if visualizations exist and update state
    const checkVisualizations = async () => {
      try {
        const response = await fetch('/api/visualizations');
        const data = await response.json();
        if (data.success) {
          setVisualizations(data.visualizations);
        }
      } catch (error) {
        console.error('Error fetching visualizations:', error);
      }
    };

    if (dataset && generatedData) {
      checkVisualizations();
    }
  }, [dataset, generatedData]);

  if (!dataset || !generatedData) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <h2 className="text-3xl font-bold tracking-tight">Data Insights</h2>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">
              Generate synthetic data first to view insights
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Data Insights</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Feature Distributions */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Feature Distributions</CardTitle>
          </CardHeader>
          <CardContent>
            {visualizations.distributions && (
              <div className="relative w-full h-[600px]">
                <Image
                  src={visualizations.distributions}
                  alt="Feature Distributions"
                  fill
                  style={{ objectFit: 'contain' }}
                  priority
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Correlation Matrix */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Correlation Matrix</CardTitle>
          </CardHeader>
          <CardContent>
            {visualizations.correlations && (
              <div className="relative w-full h-[400px]">
                <Image
                  src={visualizations.correlations}
                  alt="Correlation Matrix"
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* BIC/AIC Plot
        <Card>
          <CardHeader>
            <CardTitle>Model Selection (BIC/AIC)</CardTitle>
          </CardHeader>
          <CardContent>
            {visualizations.bic_aic && (
              <div className="relative w-full h-[400px]">
                <Image
                  src={visualizations.bic_aic}
                  alt="BIC/AIC Plot"
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
            )}
          </CardContent>
        </Card> */}
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