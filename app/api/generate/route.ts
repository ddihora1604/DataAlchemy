import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import os from 'os';

export async function POST(req: NextRequest) {
  try {
    const { data, columns, numSamples } = await req.json();
    
    // Create a temporary directory for processing
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'gmm-'));
    
    // Save the input data as CSV
    const inputPath = path.join(tempDir, 'input.csv');
    const csvContent = [
      columns.join(','),
      ...data.map((row: any[]) => row.join(','))
    ].join('\n');
    
    await fs.writeFile(inputPath, csvContent);
    
    // Run the GMM model
    const pythonScript = path.join(process.cwd(), 'app/ml/GMM.py');
    
    return new Promise((resolve, reject) => {
      const process = spawn('python', [
        pythonScript,
        '--input', inputPath,
        '--output', path.join(tempDir, 'output.csv'),
        '--samples', numSamples.toString()
      ]);
      
      let outputData = '';
      let errorData = '';
      
      process.stdout.on('data', (data) => {
        outputData += data.toString();
      });
      
      process.stderr.on('data', (data) => {
        errorData += data.toString();
      });
      
      process.on('close', async (code) => {
        if (code !== 0) {
          resolve(NextResponse.json({ 
            error: 'GMM generation failed', 
            details: errorData 
          }, { status: 500 }));
          return;
        }
        
        try {
          // Read the generated data
          const outputPath = path.join(tempDir, 'output.csv');
          const generatedData = await fs.readFile(outputPath, 'utf-8');
          
          // Clean up temporary files
          await fs.rm(tempDir, { recursive: true, force: true });
          
          resolve(NextResponse.json({ 
            success: true,
            data: generatedData,
            message: 'Synthetic data generated successfully'
          }));
        } catch (error) {
          resolve(NextResponse.json({ 
            error: 'Failed to read generated data',
            details: error
          }, { status: 500 }));
        }
      });
    });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to process request',
      details: error
    }, { status: 500 });
  }
} 