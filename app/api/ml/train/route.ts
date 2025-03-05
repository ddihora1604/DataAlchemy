import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

type ModelType = 'linear-regression' | 'random-forest' | 'gradient-boosting' | 'hist-gradient' | 'xgboost' | 'lightgbm';

// Helper to generate a single training metric update
function generateTrainingMetric(modelType: ModelType, epoch: number, totalEpochs: number) {
  const baseAccuracy: Record<ModelType, number> = {
    'linear-regression': 0.65,
    'random-forest': 0.75,
    'gradient-boosting': 0.78,
    'hist-gradient': 0.77,
    'xgboost': 0.80,
    'lightgbm': 0.79
  };

  const baseLoss: Record<ModelType, number> = {
    'linear-regression': 0.8,
    'random-forest': 0.6,
    'gradient-boosting': 0.55,
    'hist-gradient': 0.57,
    'xgboost': 0.5,
    'lightgbm': 0.52
  };

  const progress = epoch / (totalEpochs - 1);
  const noise = Math.random() * 0.02 - 0.01; // Random noise between -0.01 and 0.01
  
  return {
    epoch: epoch + 1,
    // Loss decreases exponentially
    loss: (baseLoss[modelType] || 0.7) * Math.exp(-3 * progress) + noise,
    // Accuracy increases with diminishing returns
    accuracy: (baseAccuracy[modelType] || 0.70) + (1 - (baseAccuracy[modelType] || 0.70)) * (1 - Math.exp(-2 * progress)) + noise,
    // Add validation metrics
    val_loss: ((baseLoss[modelType] || 0.7) * Math.exp(-3 * progress) + noise) * 1.1,
    val_accuracy: ((baseAccuracy[modelType] || 0.70) + (1 - (baseAccuracy[modelType] || 0.70)) * (1 - Math.exp(-2 * progress)) + noise) * 0.95
  };
}

// Sleep function to simulate training time
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function POST(request: NextRequest) {
  try {
    const { modelType, trainingData } = await request.json();
    
    // Get the number of epochs for this model type
    const epochs: Record<ModelType, number> = {
      'linear-regression': 15,
      'random-forest': 25,
      'gradient-boosting': 30,
      'hist-gradient': 30,
      'xgboost': 35,
      'lightgbm': 30
    };

    const totalEpochs = epochs[modelType as ModelType] || 20;
    
    // Create a TransformStream for sending updates
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();
    const encoder = new TextEncoder();

    // Start the training process
    (async () => {
      try {
        for (let epoch = 0; epoch < totalEpochs; epoch++) {
          // Generate metrics for this epoch
          const metrics = generateTrainingMetric(modelType as ModelType, epoch, totalEpochs);
          
          // Send the update
          const update = JSON.stringify({ type: 'update', metrics });
          await writer.write(encoder.encode(`data: ${update}\n\n`));
          
          // Simulate training time (faster for earlier epochs, slower for later ones)
          const delay = 200 + (epoch * 5); // Gradually increase delay
          await sleep(delay);
        }

        // Send completion message
        const finalMetrics = generateTrainingMetric(modelType as ModelType, totalEpochs - 1, totalEpochs);
        const completion = JSON.stringify({ 
          type: 'complete',
          finalMetrics
        });
        await writer.write(encoder.encode(`data: ${completion}\n\n`));
      } catch (error) {
        const errorMsg = JSON.stringify({ type: 'error', message: 'Training failed' });
        await writer.write(encoder.encode(`data: ${errorMsg}\n\n`));
      } finally {
        await writer.close();
      }
    })();

    // Return the response with the stream
    return new Response(stream.readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to train model' },
      { status: 500 }
    );
  }
} 