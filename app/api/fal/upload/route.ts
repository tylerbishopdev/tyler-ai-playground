import * as fal from '@fal-ai/serverless-client';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return Response.json({ error: 'File must be an image' }, { status: 400 });
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return Response.json({ error: 'File size must be less than 10MB' }, { status: 400 });
    }

    // Upload to FAL storage
    const uploadResult = await fal.storage.upload(file);

    return Response.json({ url: uploadResult });
  } catch (error) {
    console.error('Upload error:', error);
    return Response.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
