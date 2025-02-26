"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"

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
      
      <Tabs defaultValue="gan" className="space-y-4">
        <TabsList className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-1 rounded-xl">
          <TabsTrigger 
            value="gan" 
            className="data-[state=active]:bg-primary/10 transition-all duration-200 rounded-lg"
          >
            Tabular GAN
          </TabsTrigger>
          <TabsTrigger 
            value="vae" 
            className="data-[state=active]:bg-primary/10 transition-all duration-200 rounded-lg"
          >
            VAE
          </TabsTrigger>
          <TabsTrigger 
            value="copula" 
            className="data-[state=active]:bg-primary/10 transition-all duration-200 rounded-lg"
          >
            Copula-based Synthesis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="gan">
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <Card className="border-primary/10 shadow-lg hover:shadow-primary/5 transition-all duration-300 rounded-xl">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Generative Adversarial Networks (GANs)
                </CardTitle>
                <CardDescription className="text-base">
                  Understanding how GANs generate realistic tabular data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <motion.div variants={staggeredList} initial="hidden" animate="visible">
                  <motion.div variants={listItem} className="space-y-2">
                    <h3 className="text-lg font-semibold text-primary/90">How GANs Work</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      GANs consist of two neural networks competing against each other: a generator that creates synthetic data and a discriminator that tries to distinguish between real and synthetic data. Through this adversarial process, the generator learns to create increasingly realistic data.
                    </p>
                  </motion.div>

                  <motion.div variants={listItem} className="space-y-2 mt-6">
                    <h3 className="text-lg font-semibold text-primary/90">Strengths</h3>
                    <motion.ul 
                      className="list-disc pl-6 text-muted-foreground space-y-2"
                      variants={staggeredList}
                    >
                      <motion.li variants={listItem}>Excellent at capturing complex data distributions</motion.li>
                      <motion.li variants={listItem}>Can generate highly realistic synthetic data</motion.li>
                      <motion.li variants={listItem}>Good for handling mixed data types</motion.li>
                      <motion.li variants={listItem}>Preserves intricate relationships between variables</motion.li>
                      <motion.li variants={listItem}>Scalable to large datasets</motion.li>
                    </motion.ul>
                  </motion.div>

                  <motion.div variants={listItem} className="space-y-2 mt-6">
                    <h3 className="text-lg font-semibold text-primary/90">Limitations</h3>
                    <motion.ul 
                      className="list-disc pl-6 text-muted-foreground space-y-2"
                      variants={staggeredList}
                    >
                      <motion.li variants={listItem}>Training can be unstable and requires careful tuning</motion.li>
                      <motion.li variants={listItem}>May suffer from mode collapse</motion.li>
                      <motion.li variants={listItem}>Computationally intensive</motion.li>
                      <motion.li variants={listItem}>Requires large training datasets</motion.li>
                    </motion.ul>
                  </motion.div>

                  <motion.div variants={listItem} className="space-y-2 mt-6">
                    <h3 className="text-lg font-semibold text-primary/90">Use Cases</h3>
                    <motion.ul 
                      className="list-disc pl-6 text-muted-foreground space-y-2"
                      variants={staggeredList}
                    >
                      <motion.li variants={listItem}>Financial transaction data generation</motion.li>
                      <motion.li variants={listItem}>Healthcare record synthesis</motion.li>
                      <motion.li variants={listItem}>Customer behavior simulation</motion.li>
                      <motion.li variants={listItem}>Market research data augmentation</motion.li>
                      <motion.li variants={listItem}>Testing and development environments</motion.li>
                    </motion.ul>
                  </motion.div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="vae">
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <Card className="border-primary/10 shadow-lg hover:shadow-primary/5 transition-shadow duration-300">
              <CardHeader>
                <CardTitle>Variational Autoencoders (VAEs)</CardTitle>
                <CardDescription>Learning latent representations for data generation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <h3 className="text-lg font-semibold">How VAEs Work</h3>
                <p className="text-muted-foreground">
                  VAEs learn a compressed, probabilistic representation of data by encoding it into a latent space and then decoding it back. This architecture allows for both data compression and generation of new samples by sampling from the learned latent space.
                </p>

                <h3 className="text-lg font-semibold">Strengths</h3>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Excellent for continuous variables</li>
                  <li>More stable training compared to GANs</li>
                  <li>Provides meaningful latent representations</li>
                  <li>Good at handling missing data</li>
                  <li>Probabilistic nature allows uncertainty quantification</li>
                </ul>

                <h3 className="text-lg font-semibold">Limitations</h3>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Generated samples may be slightly blurry/imprecise</li>
                  <li>Can struggle with discrete variables</li>
                  <li>Limited by Gaussian assumptions in latent space</li>
                  <li>May not capture sharp features in data</li>
                </ul>

                <h3 className="text-lg font-semibold">Use Cases</h3>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Medical imaging data synthesis</li>
                  <li>Sensor data generation</li>
                  <li>Anomaly detection</li>
                  <li>Feature learning and dimensionality reduction</li>
                  <li>Missing data imputation</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="copula">
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <Card className="border-primary/10 shadow-lg hover:shadow-primary/5 transition-shadow duration-300">
              <CardHeader>
                <CardTitle>Copula-based Synthesis</CardTitle>
                <CardDescription>Statistical approach to modeling data dependencies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <h3 className="text-lg font-semibold">How Copulas Work</h3>
                <p className="text-muted-foreground">
                  Copula-based methods separate the modeling of marginal distributions from their dependencies. This allows for flexible modeling of complex relationships while preserving the statistical properties of individual variables.
                </p>

                <h3 className="text-lg font-semibold">Strengths</h3>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Strong theoretical foundation in statistics</li>
                  <li>Excellent for preserving correlations</li>
                  <li>Works well with small datasets</li>
                  <li>Computationally efficient</li>
                  <li>Highly interpretable results</li>
                </ul>

                <h3 className="text-lg font-semibold">Limitations</h3>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>May not capture complex non-linear relationships</li>
                  <li>Limited by choice of copula family</li>
                  <li>Less flexible than deep learning approaches</li>
                  <li>Requires domain expertise for copula selection</li>
                </ul>

                <h3 className="text-lg font-semibold">Use Cases</h3>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Financial risk modeling</li>
                  <li>Insurance claim generation</li>
                  <li>Climate data synthesis</li>
                  <li>Demographic data generation</li>
                  <li>Portfolio simulation</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
} 