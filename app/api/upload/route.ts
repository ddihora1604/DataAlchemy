import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');

        if (!file || !(file instanceof Blob)) {
            return NextResponse.json({ error: 'No valid file uploaded' }, { status: 400 });
        }

        // Create uploads directory if it doesn't exist
        const uploadsDir = path.join(process.cwd(), 'uploads');
        await mkdir(uploadsDir, { recursive: true });

        // Save the file
        const filePath = path.join(uploadsDir, 'dataset.csv');
        const arrayBuffer = await file.arrayBuffer();
        await writeFile(filePath, new Uint8Array(arrayBuffer));

        return NextResponse.json({ 
            success: true,
            message: 'File uploaded successfully',
            filePath: filePath
        });
    } catch (error) {
        console.error('Error in upload route:', error);
        return NextResponse.json({ 
            error: 'Internal server error',
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
} 