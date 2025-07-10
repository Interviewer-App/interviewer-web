import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('recording');
    const interviewId = formData.get('interviewId');
    const candidateId = formData.get('candidateId');
    const timestamp = formData.get('timestamp');

    if (!file) {
      return NextResponse.json(
        { error: 'No recording file provided' },
        { status: 400 }
      );
    }

    if (!interviewId || !candidateId) {
      return NextResponse.json(
        { error: 'Missing required fields: interviewId or candidateId' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create directory structure
    const uploadsDir = path.join(process.cwd(), 'uploads', 'recordings', interviewId);
    await mkdir(uploadsDir, { recursive: true });

    // Generate filename
    const fileExtension = file.name.split('.').pop() || 'webm';
    const fileName = `${candidateId}-${Date.now()}.${fileExtension}`;
    const filePath = path.join(uploadsDir, fileName);

    // Save file
    await writeFile(filePath, buffer);

    // Here you could also save metadata to a database
    const recordingMetadata = {
      interviewId,
      candidateId,
      fileName,
      filePath,
      fileSize: buffer.length,
      timestamp,
      uploadedAt: new Date().toISOString(),
    };

    // TODO: Save metadata to your database
    console.log('Recording saved:', recordingMetadata);

    return NextResponse.json({
      success: true,
      message: 'Recording saved successfully',
      data: {
        fileName,
        fileSize: buffer.length,
        uploadedAt: recordingMetadata.uploadedAt,
      },
    });

  } catch (error) {
    console.error('Error saving recording:', error);
    return NextResponse.json(
      { error: 'Failed to save recording' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Screen recording API endpoint' },
    { status: 200 }
  );
}
