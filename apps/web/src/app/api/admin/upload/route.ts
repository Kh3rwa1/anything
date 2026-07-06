import { createAdminClient } from '@/lib/appwrite';
import { requireAdmin, rejectCrossOrigin } from '@/lib/api-security';
import { Storage } from 'node-appwrite';

export async function POST(request: Request) {
  try {
    const access = await requireAdmin();
    if (!access.ok) return access.response;
    const originError = rejectCrossOrigin(request);
    if (originError) return originError;

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 });
    }

    const { client } = createAdminClient();
    const storage = new Storage(client);

    // Upload to Appwrite using standard Web File API directly
    const uploadedFile = await storage.createFile({
      bucketId: 'course-assets',
      fileId: 'unique()',
      file: file,
    });

    // Build the public view URL
    const endpoint = process.env.APPWRITE_ENDPOINT || 'https://sgp.cloud.appwrite.io/v1';
    const projectId = process.env.APPWRITE_PROJECT_ID || '6a4a5761002f29a00e5b';
    const url = `${endpoint}/storage/buckets/course-assets/files/${uploadedFile.$id}/view?project=${projectId}`;

    return Response.json({
      url,
      id: uploadedFile.$id,
    });
  } catch (error: any) {
    console.error('File upload failed:', error);
    return Response.json({ error: error?.message || 'File upload failed' }, { status: 500 });
  }
}
