import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { spawn } from 'child_process';
import path from 'path';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');
        const numSamples = formData.get('numSamples');

        if (!file || !(file instanceof Blob)) {
            return NextResponse.json({ error: 'No valid file uploaded' }, { status: 400 });
        }

        if (!numSamples || isNaN(Number(numSamples))) {
            return NextResponse.json({ error: 'Invalid number of samples' }, { status: 400 });
        }

        // Create necessary directories
        const uploadsDir = path.join(process.cwd(), 'uploads');
        const publicDir = path.join(process.cwd(), 'public');
        await mkdir(uploadsDir, { recursive: true });
        await mkdir(publicDir, { recursive: true });

        // Save the uploaded file
        const filePath = path.join(uploadsDir, 'dataset.csv');
        const arrayBuffer = await file.arrayBuffer();
        await writeFile(filePath, new Uint8Array(arrayBuffer));

        // Run the Python script with the specified number of samples
        return new Promise((resolve) => {
            const pythonProcess = spawn('python', [
                'app/ml/GMM_Model.py',
                '--input', filePath,
                '--samples', numSamples.toString(),
                '--public_dir', publicDir
            ]);

            let stdoutData = '';
            let stderrData = '';

            pythonProcess.stdout.on('data', (data) => {
                stdoutData += data.toString();
                console.log('Python stdout:', data.toString());
            });

            pythonProcess.stderr.on('data', (data) => {
                stderrData += data.toString();
                console.error('Python stderr:', data.toString());
            });

            pythonProcess.on('close', (code) => {
                console.log('Python process exited with code:', code);
                
                if (code === 0) {
                    resolve(NextResponse.json({
                        success: true,
                        message: 'Synthetic data generated successfully',
                        stdout: stdoutData,
                        visualizations: {
                            distributions: '/distributions.png',
                            correlations: '/correlation_matrix.png',
                            bic_aic: '/bic_aic_plot.png'
                        }
                    }));
                } else {
                    resolve(NextResponse.json({
                        error: 'Failed to generate synthetic data',
                        details: stderrData || 'Unknown error occurred',
                        stdout: stdoutData
                    }, { status: 500 }));
                }
            });
        });
    } catch (error) {
        console.error('Error in generate route:', error);
        return NextResponse.json({ 
            error: 'Internal server error',
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
} 