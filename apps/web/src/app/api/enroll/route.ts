import { createAdminClient, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite';
import { Query } from 'node-appwrite';
import {
  inputErrorResponse,
  readJsonObject,
  rejectCrossOrigin,
  requiredString,
  requireSession,
} from '@/lib/api-security';

export async function POST(request: Request) {
  try {
    const access = await requireSession();
    if (!access.ok) return access.response;
    const originError = rejectCrossOrigin(request);
    if (originError) return originError;

    const body = await readJsonObject(request);
    const courseId = String(body.courseId);
    const code = requiredString(body.code, 'Enrollment code', 80).toUpperCase();

    const userId = access.session.user.id;
    const { databases } = createAdminClient();

    // Check existing enrollment
    const existing = await databases.listDocuments(DATABASE_ID, COLLECTIONS.ENROLLMENTS, [
      Query.equal('user_id', userId),
      Query.equal('course_id', courseId),
      Query.limit(1)
    ]);

    if (existing.total > 0) {
      return Response.json({
        success: true,
        enrollment: {
          id: existing.documents[0].$id,
          ...existing.documents[0]
        },
        already_enrolled: true
      });
    }

    // Retrieve code
    const codesRes = await databases.listDocuments(DATABASE_ID, COLLECTIONS.CODES, [
      Query.equal('code', code),
      Query.equal('is_active', true),
      Query.limit(1)
    ]);

    if (codesRes.total === 0) {
      return Response.json({ error: 'Invalid or expired enrollment code.' }, { status: 400 });
    }

    const codeDoc = codesRes.documents[0];

    // Validate rules
    if (codeDoc.course_id && String(codeDoc.course_id) !== courseId) {
      return Response.json({ error: 'This code is not valid for this course.' }, { status: 400 });
    }
    if (codeDoc.max_uses !== null && codeDoc.used_count >= codeDoc.max_uses) {
      return Response.json({ error: 'This code has reached its usage limit.' }, { status: 400 });
    }

    // Increment code use count
    await databases.updateDocument(DATABASE_ID, COLLECTIONS.CODES, codeDoc.$id, {
      used_count: codeDoc.used_count + 1
    });

    // Create enrollment document
    const enrollment = await databases.createDocument(DATABASE_ID, COLLECTIONS.ENROLLMENTS, 'unique()', {
      user_id: userId,
      course_id: courseId
    });

    return Response.json({
      success: true,
      enrollment: {
        id: enrollment.$id,
        ...enrollment
      },
      discount_pct: codeDoc.discount_pct,
      already_enrolled: false,
    });
  } catch (error) {
    return inputErrorResponse(error, 'Failed to enroll');
  }
}

export async function GET() {
  try {
    const access = await requireSession();
    if (!access.ok) return access.response;

    const userId = access.session.user.id;
    const { databases } = createAdminClient();

    const enrollRes = await databases.listDocuments(DATABASE_ID, COLLECTIONS.ENROLLMENTS, [
      Query.equal('user_id', userId),
      Query.limit(100)
    ]);

    const enrollments = [];
    for (const doc of enrollRes.documents) {
      try {
        const course = await databases.getDocument(DATABASE_ID, COLLECTIONS.COURSES, doc.course_id);
        enrollments.push({
          id: doc.$id,
          user_id: doc.user_id,
          course_id: doc.course_id,
          created_at: doc.$createdAt,
          title: course.title,
          instructor: course.instructor,
          thumbnail_url: course.thumbnail_url,
          duration: course.duration
        });
      } catch {
        // Skip course if it has been deleted
      }
    }

    return Response.json(enrollments);
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Failed to fetch enrollments' }, { status: 500 });
  }
}
