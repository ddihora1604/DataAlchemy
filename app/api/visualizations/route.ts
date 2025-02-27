import { NextResponse } from 'next/server';
import { existsSync } from 'fs';
import path from 'path';

export async function GET() {
    try {
        const publicDir = path.join(process.cwd(), 'public');
        const distributionsPath = path.join(publicDir, 'distributions.png');
        const correlationsPath = path.join(publicDir, 'correlation_matrix.png');
        const bicAicPath = path.join(publicDir, 'bic_aic_plot.png');

        const visualizations = {
            distributions: existsSync(distributionsPath) ? '/distributions.png' : '',
            correlations: existsSync(correlationsPath) ? '/correlation_matrix.png' : '',
            bic_aic: existsSync(bicAicPath) ? '/bic_aic_plot.png' : ''
        };

        return NextResponse.json({
            success: true,
            visualizations
        });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ 
            error: 'Internal server error',
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
} 