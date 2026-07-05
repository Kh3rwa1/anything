import { createAdminClient, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite';
import { requireAdmin } from '@/lib/api-security';
import { Users, Query } from 'node-appwrite';

export async function GET() {
  try {
    const access = await requireAdmin();
    if (!access.ok) return access.response;

    const { client, databases } = createAdminClient();
    const sdkUsers = new Users(client);

    // Count students (total users from Auth)
    const usersList = await sdkUsers.list([Query.limit(1)]);
    const totalStudents = usersList.total;

    // Count active enrollments
    const enrollRes = await databases.listDocuments(DATABASE_ID, COLLECTIONS.ENROLLMENTS, [
      Query.limit(1)
    ]);
    const activeEnrollments = enrollRes.total;

    // Calculate total revenue
    // 1. Get all courses to map course_id -> price
    const coursesRes = await databases.listDocuments(DATABASE_ID, COLLECTIONS.COURSES, [
      Query.limit(100)
    ]);
    const coursePriceMap: Record<string, number> = {};
    for (const course of coursesRes.documents) {
      coursePriceMap[course.$id] = course.price || 0;
    }

    // 2. Fetch all enrollments (up to 5000)
    const allEnrollments = await databases.listDocuments(DATABASE_ID, COLLECTIONS.ENROLLMENTS, [
      Query.limit(5000)
    ]);

    let totalRevenue = 0;
    for (const enroll of allEnrollments.documents) {
      const price = coursePriceMap[enroll.course_id] || 0;
      totalRevenue += price;
    }

    return Response.json({
      total_students: totalStudents,
      active_enrollments: activeEnrollments,
      total_revenue: totalRevenue
    });
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
