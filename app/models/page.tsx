"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { Brain, Settings2, Shield, ChartBar, Code2, Lightbulb, AlertCircle } from "lucide-react"

export default function ModelInformation() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 }
  }

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  }

  const staggeredList = {
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    },
    hidden: {
      opacity: 0
    }
  }

  const listItem = {
    visible: { opacity: 1, x: 0 },
    hidden: { opacity: 0, x: -20 }
  }

  return (
    <motion.div 
      className="flex-1 space-y-4 p-8 pt-6 max-w-6xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="flex items-center justify-between space-y-2"
        {...fadeIn}
      >
        <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Model Information
        </h2>
      </motion.div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 lg:max-w-[400px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="technical">Technical Details</TabsTrigger>
          <TabsTrigger value="parameters">Parameters</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    Purpose
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    The Gaussian Mixture Model generates synthetic data by modeling the underlying probability distribution of numerical features in your dataset.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    Key Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <motion.ul
                    variants={staggeredList}
                    initial="hidden"
                    animate="visible"
                    className="space-y-2 text-muted-foreground"
                  >
                    <motion.li variants={listItem}>• Automatic component selection</motion.li>
                    <motion.li variants={listItem}>• Handles missing values</motion.li>
                    <motion.li variants={listItem}>• Data scaling and normalization</motion.li>
                    <motion.li variants={listItem}>• Preserves statistical relationships</motion.li>
                  </motion.ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Advantages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <motion.ul
                    variants={staggeredList}
                    initial="hidden"
                    animate="visible"
                    className="space-y-2 text-muted-foreground"
                  >
                    <motion.li variants={listItem}>• Privacy-preserving generation</motion.li>
                    <motion.li variants={listItem}>• Maintains data distributions</motion.li>
                    <motion.li variants={listItem}>• Efficient computation</motion.li>
                    <motion.li variants={listItem}>• Scalable to large datasets</motion.li>
                  </motion.ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="technical">
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code2 className="h-5 w-5 text-primary" />
                  Implementation Details
                </CardTitle>
                <CardDescription>
                  Technical aspects of the Gaussian Mixture Model implementation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-2">Preprocessing Pipeline</h4>
                    <p className="text-muted-foreground">
                      1. Data preprocessing steps<br />
                      2. Feature engineering<br />
                      3. Data normalization
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Model Architecture</h4>
                    <p className="text-muted-foreground">
                      The model architecture details will be provided based on the selected generation method.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Generation Process</h4>
                    <p className="text-muted-foreground">
                      Synthetic samples are generated using the selected model and configuration.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="parameters">
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings2 className="h-5 w-5 text-primary" />
                  Model Parameters
                </CardTitle>
                <CardDescription>
                  Key parameters and their impact on the generation process
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <h4 className="font-medium">Number of Components</h4>
                      <p className="text-sm text-muted-foreground">
                        Automatically selected using BIC criterion (1-5 range)
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Covariance Type</h4>
                      <p className="text-sm text-muted-foreground">
                        Full covariance matrix to capture feature relationships
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Regularization</h4>
                      <p className="text-sm text-muted-foreground">
                        reg_covar=1e-6 for numerical stability
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Initialization</h4>
                      <p className="text-sm text-muted-foreground">
                        n_init=10 attempts to find optimal starting points
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Card className="bg-muted/50">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                          <AlertCircle className="h-5 w-5 text-primary" />
                          Limitations
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li>• Currently supports only numerical features</li>
                          <li>• Assumes underlying Gaussian distributions</li>
                          <li>• May not capture complex non-linear relationships</li>
                          <li>• Memory usage scales with dataset size</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
} 