import { createAdminClient, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite';
import { Query } from 'node-appwrite';
import {
  finiteNumber,
  inputErrorResponse,
  optionalString,
  readJsonObject,
  rejectCrossOrigin,
  requiredString,
  requireAdmin,
} from '@/lib/api-security';

export async function GET(request: Request) {
  try {
    const id = new URL(request.url).searchParams.get('id');
    // Admin client is necessary here because Appwrite requires a server-side
    // API key for database reads — a public client cannot access databases.
    const { databases } = createAdminClient();

    if (id) {
      try {
        const course = await databases.getDocument(DATABASE_ID, COLLECTIONS.COURSES, id);
        
        // Count lessons
        const lessons = await databases.listDocuments(DATABASE_ID, COLLECTIONS.LESSONS, [
          Query.equal('course_id', id),
          Query.limit(1)
        ]);

        return Response.json({
          ...course,
          id: course.$id,
          lesson_count: lessons.total,
        });
      } catch {
        return Response.json({ error: 'Course not found' }, { status: 404 });
      }
    }

    const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.COURSES, [
      Query.orderDesc('$createdAt'),
      Query.limit(100)
    ]);

    const courses = response.documents.map(doc => ({
      ...doc,
      id: doc.$id,
    }));

    return Response.json(courses);
  } catch (error) {
    return inputErrorResponse(error, 'Failed to fetch courses');
  }
}

export async function POST(request: Request) {
  try {
    const access = await requireAdmin();
    if (!access.ok) return access.response;
    const originError = rejectCrossOrigin(request);
    if (originError) return originError;

    const body = await readJsonObject(request);
    const { title, description, price, category_id, instructor, level, duration, thumbnail_url } =
      body;

    const { databases } = createAdminClient();

    const data = {
      title: requiredString(title, 'title', 160),
      description: optionalString(description, 'description', 5000) || '',
      price: finiteNumber(price, 'price', { min: 0, max: 1000000 }),
      category_id: String(category_id),
      instructor: requiredString(instructor, 'instructor', 160),
      level: requiredString(level, 'level', 40),
      duration: requiredString(duration, 'duration', 80),
      thumbnail_url: optionalString(thumbnail_url, 'thumbnail_url', 2000) || '',
    };

    const doc = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.COURSES,
      'unique()',
      data
    );

    return Response.json({
      ...doc,
      id: doc.$id,
    });
  } catch (error) {
    return inputErrorResponse(error, 'Failed to create course');
  }
}
