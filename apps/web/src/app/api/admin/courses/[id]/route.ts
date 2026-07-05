import { createAdminClient, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite';
import {
  finiteNumber,
  inputErrorResponse,
  optionalString,
  readJsonObject,
  rejectCrossOrigin,
  requiredString,
  requireAdmin,
} from '@/lib/api-security';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const access = await requireAdmin();
    if (!access.ok) return access.response;
    const originError = rejectCrossOrigin(request);
    if (originError) return originError;

    const { id } = await params;
    const body = await readJsonObject(request);
    const { title, description, price, instructor, level, duration, thumbnail_url, category_id } =
      body;

    const { databases } = createAdminClient();

    const data = {
      title: requiredString(title, 'title', 160),
      description: optionalString(description, 'description', 5000) || '',
      price: finiteNumber(price, 'price', { min: 0, max: 1000000 }),
      instructor: requiredString(instructor, 'instructor', 160),
      level: requiredString(level, 'level', 40),
      duration: requiredString(duration, 'duration', 80),
      thumbnail_url: optionalString(thumbnail_url, 'thumbnail_url', 2000) || '',
      category_id: String(category_id),
    };

    try {
      const doc = await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.COURSES,
        id,
        data
      );
      return Response.json({
        ...doc,
        id: doc.$id,
      });
    } catch {
      return Response.json({ error: 'Course not found' }, { status: 404 });
    }
  } catch (error) {
    return inputErrorResponse(error, 'Failed to update course');
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const access = await requireAdmin();
    if (!access.ok) return access.response;
    const originError = rejectCrossOrigin(request);
    if (originError) return originError;

    const { id } = await params;
    const { databases } = createAdminClient();

    await databases.deleteDocument(DATABASE_ID, COLLECTIONS.COURSES, id);
    return Response.json({ success: true });
  } catch (error) {
    return inputErrorResponse(error, 'Failed to delete course');
  }
}
