import { createAdminClient, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite';
import { requireAdmin } from '@/lib/api-security';
import { Users, Query } from 'node-appwrite';

export async function GET() {
  try {
    const access = await requireAdmin();
    if (!access.ok) return access.response;

    const { client, databases } = createAdminClient();
    const sdkUsers = new Users(client);

    // 1. Totals
    const usersList = await sdkUsers.list([Query.limit(1)]);
    const totalStudents = usersList.total;

    const enrollRes = await databases.listDocuments(DATABASE_ID, COLLECTIONS.ENROLLMENTS, [
      Query.limit(5000)
    ]);
    const totalEnrollments = enrollRes.total;

    // Map course prices
    const coursesRes = await databases.listDocuments(DATABASE_ID, COLLECTIONS.COURSES, [
      Query.limit(100)
    ]);
    const courseMap: Record<string, any> = {};
    for (const course of coursesRes.documents) {
      courseMap[course.$id] = course;
    }

    let totalRevenue = 0;
    const courseEnrollmentCounts: Record<string, number> = {};
    for (const enroll of enrollRes.documents) {
      const cid = enroll.course_id;
      const course = courseMap[cid];
      if (course) {
        totalRevenue += course.price || 0;
        courseEnrollmentCounts[cid] = (courseEnrollmentCounts[cid] || 0) + 1;
      }
    }

    // ROADMAP: Completion tracking requires a lessons_completed collection — not yet implemented
    const completions = 0;

    // 2. Monthly analytics for last 6 months
    const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData = [];
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthLabel = MONTH_NAMES[d.getMonth()];
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      monthlyData.push({ month: monthLabel, month_key: monthKey, students: 0, revenue: 0 });
    }

    for (const enroll of enrollRes.documents) {
      const date = new Date(enroll.$createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const match = monthlyData.find(m => m.month_key === monthKey);
      if (match) {
        match.students += 1;
        const course = courseMap[enroll.course_id];
        if (course) {
          match.revenue += course.price || 0;
        }
      }
    }

    // 3. Top Courses
    const topCoursesList = coursesRes.documents.map(course => {
      const count = courseEnrollmentCounts[course.$id] || 0;
      const rev = count * (course.price || 0);
      return {
        id: course.$id,
        title: course.title,
        price: course.price,
        category: course.category_id || 'General',
        enrollment_count: count,
        revenue: rev,
      };
    });

    topCoursesList.sort((a, b) => b.enrollment_count - a.enrollment_count);
    const top5Courses = topCoursesList.slice(0, 5);
    const maxEnrollments = Math.max(...top5Courses.map(c => c.enrollment_count), 1);
    const topCourses = top5Courses.map(c => ({
      ...c,
      pct: Math.round((c.enrollment_count / maxEnrollments) * 100),
    }));

    return Response.json({
      totals: {
        total_students: totalStudents,
        total_enrollments: totalEnrollments,
        total_revenue: totalRevenue,
        completions: completions,
      },
      monthly: monthlyData.map(m => ({
        month: m.month,
        students: m.students,
        revenue: m.revenue,
      })),
      topCourses,
    });
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
