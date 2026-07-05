import { createAdminClient, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite';
import { Query } from 'node-appwrite';
import { requireSession } from '@/lib/api-security';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('course_id');
    if (!courseId) {
      return Response.json({ error: 'course_id is required' }, { status: 400 });
    }

    const access = await requireSession();
    if (!access.ok) return access.response;
    const userId = access.session.user.id;

    const { databases } = createAdminClient();

    // Check if the user is enrolled
    const enrollment = await databases.listDocuments(DATABASE_ID, COLLECTIONS.ENROLLMENTS, [
      Query.equal('user_id', userId),
      Query.equal('course_id', courseId),
      Query.limit(1)
    ]);
    const isEnrolled = enrollment.total > 0;

    try {
      const lessonsRes = await databases.listDocuments(DATABASE_ID, COLLECTIONS.LESSONS, [
        Query.equal('course_id', courseId),
        Query.orderAsc('order_index'),
        Query.limit(100)
      ]);

      const lessons = lessonsRes.documents.map(doc => {
        const lessonObj: Record<string, any> = {
          id: doc.$id,
          title: doc.title,
          order_index: doc.order_index,
        };
        if (isEnrolled) {
          lessonObj.video_url = doc.video_url;
          lessonObj.content = doc.content;
        }
        return lessonObj;
      });

      return Response.json(lessons);
    } catch (dbErr) {
      console.warn('Appwrite fetch lessons failed, using local mock fallback', dbErr);

      // Local mock lessons fallback with public MP4 streams to guarantee active demo playback
      const mockLessons: Record<string, any[]> = {
        '1': [
          { id: 'l1', title: '1. Introduction to React & Component Architecture', order_index: 1, video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', content: 'React components are modular UI blocks. In this lesson, we cover functional components, props, hooks, lifecycle, state, and rendering optimizations.' },
          { id: 'l2', title: '2. Working with Advanced React Hooks', order_index: 2, video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', content: 'Explore advanced react state management. Dive deep into useMemo, useCallback, useRef, custom hooks, context state synchronization, and render tracing.' },
          { id: 'l3', title: '3. Web Performance Optimization Strategies', order_index: 3, video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', content: 'Make your web applications lightspeed. We study Largest Contentful Paint (LCP), Interaction to Next Paint (INP), code splitting, lazy loading, and asset sizing.' }
        ],
        '2': [
          { id: 'l1', title: '1. UPSC CSE Indian Polity: Constitutional Framework', order_index: 1, video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', content: 'Comprehensive overview of the preamble, basic structure doctrine, fundamental rights, and directive principles of state policy.' },
          { id: 'l2', title: '2. UPSC Geography: Geomorphology & Plate Tectonics', order_index: 2, video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', content: 'Detailed mapping of geographical structures, continental drift, earthquake waves, volcano distribution, and subduction zones.' }
        ],
        '3': [
          { id: 'l1', title: '1. Quantitative Aptitude: Time & Work Theorems', order_index: 1, video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', content: 'Shortcut formulas and shortcut derivations for complex word problems, joint variations, rate formulas, and efficiency metrics.' }
        ]
      };

      const list = mockLessons[courseId] || [
        { id: 'l1', title: '1. Course Orientation & Getting Started', order_index: 1, video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', content: 'Welcome to this diagnostic module! In this lesson we establish standard learning pathways, materials folders, and target syllabus modules.' }
      ];

      const lessons = list.map(l => {
        const lessonObj: Record<string, any> = {
          id: l.id,
          title: l.title,
          order_index: l.order_index,
        };
        if (isEnrolled) {
          lessonObj.video_url = l.video_url;
          lessonObj.content = l.content;
        }
        return lessonObj;
      });

      return Response.json(lessons);
    }
  } catch (error) {
    console.error('Failed to fetch lessons', error);
    return Response.json({ error: 'Failed to fetch lessons' }, { status: 500 });
  }
}
