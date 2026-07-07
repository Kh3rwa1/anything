const fs = require('fs');
const path = require('path');
const { Client, Databases } = require('node-appwrite');

// 1. Parse .env.local manually
const envPath = path.resolve(__dirname, '../../.env.local');
if (!fs.existsSync(envPath)) {
  console.error(`.env.local not found at ${envPath}`);
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return;
  const parts = trimmed.split('=');
  if (parts.length >= 2) {
    const key = parts[0].trim();
    const value = parts.slice(1).join('=').trim();
    env[key] = value;
  }
});

const endpoint = env.APPWRITE_ENDPOINT;
const projectId = env.APPWRITE_PROJECT_ID;
const apiKey = env.APPWRITE_API_KEY;
const databaseId = env.APPWRITE_DATABASE_ID || 'main';

if (!endpoint || !projectId || !apiKey) {
  console.error('Missing configuration in .env.local:', { endpoint, projectId, apiKey: apiKey ? '***' : undefined });
  process.exit(1);
}

console.log('Using endpoint:', endpoint);
console.log('Using project ID:', projectId);

// 2. Initialize SDK client
const client = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId)
  .setKey(apiKey);

const databases = new Databases(client);

const COLLECTIONS = {
  COURSES: 'job_prep_courses',
  LESSONS: 'job_prep_lessons',
  ENROLLMENTS: 'job_prep_enrollments',
  CODES: 'job_prep_enrollment_codes',
  NOTIFICATIONS: 'job_prep_notifications',
  SETTINGS: 'job_prep_settings',
  MOCK_TESTS: 'job_prep_mock_tests',
  QUESTIONS: 'job_prep_questions',
};

const SEED_COURSES = [
  {
    id: '1',
    title: 'SDE Job Preparation Course',
    description: 'Master JavaScript, React, and Data Structures & Algorithms for premium product companies like Amazon, Google, and TCS.',
    price: 4999,
    category_id: 'SDE',
    instructor: 'Senior Engineer',
    level: 'Intermediate',
    duration: '40 hours',
    thumbnail_url: ''
  },
  {
    id: '2',
    title: 'UPSC General Studies Mastery',
    description: 'Comprehensive preparation course covering History, Polity, Geography, Economics, and the Indian Constitution.',
    price: 9999,
    category_id: 'UPSC',
    instructor: 'IAS Mentor',
    level: 'All Levels',
    duration: '120 hours',
    thumbnail_url: ''
  },
  {
    id: '3',
    title: 'Quantitative Aptitude Diagnostic Prep',
    description: 'Essential quantitative concepts, speed mathematics, probability, and logical reasoning diagnostics for campus placements.',
    price: 1999,
    category_id: 'Aptitude',
    instructor: 'Aptitude Expert',
    level: 'Beginner',
    duration: '25 hours',
    thumbnail_url: ''
  }
];

const SEED_LESSONS = [
  // SDE
  { course_id: '1', title: 'Introduction to JavaScript Engine & Execution Context', video_url: 'https://www.w3schools.com/html/mov_bbb.mp4', content: 'In this lesson, we cover the call stack, execution context, and single-threaded nature of JavaScript.', order_index: 1 },
  { course_id: '1', title: 'Deep Dive into Closures and Scope Chains', video_url: 'https://www.w3schools.com/html/mov_bbb.mp4', content: 'Learn how variables are stored in memory and how lexical environments build closure chains.', order_index: 2 },
  { course_id: '1', title: 'React 19 Reconciliation & Virtual DOM', video_url: 'https://www.w3schools.com/html/mov_bbb.mp4', content: 'Explore how React diffs the Virtual DOM and updates browser layouts efficiently.', order_index: 3 },
  // UPSC
  { course_id: '2', title: 'Introduction to Preamble & Constitutional Framework', video_url: 'https://www.w3schools.com/html/mov_bbb.mp4', content: 'An overview of the historical pillars and philosophy behind the Preamble of India.', order_index: 1 },
  { course_id: '2', title: 'Fundamental Rights & Directive Principles (DPSP)', video_url: 'https://www.w3schools.com/html/mov_bbb.mp4', content: 'Polity core concepts regarding individual liberties and state objectives.', order_index: 2 },
  // Aptitude
  { course_id: '3', title: 'Time, Speed & Distance Essentials', video_url: 'https://www.w3schools.com/html/mov_bbb.mp4', content: 'Master key shortcuts for solving relative speed, average speed, and crossing train problems.', order_index: 1 }
];

const SEED_CODES = [
  { code: 'WELCOME50', course_id: '', discount_pct: 50, max_uses: 100, is_active: true, used_count: 0 },
  { code: 'SDE100', course_id: '1', discount_pct: 100, max_uses: 50, is_active: true, used_count: 0 }
];

const SEED_SETTINGS = [
  { key: 'platform_name', value: 'IAs Academy' },
  { key: 'tagline', value: 'Premium Job Preparation Platform' },
  { key: 'support_email', value: 'support@ias.academy' },
  { key: 'currency', value: 'INR' }
];

const SEED_MOCK_TESTS = [
  { id: 'sde-js-react', course_id: '1', title: 'JavaScript & React Core Concept Test', duration_minutes: 15, question_count: 10 },
  { id: 'sde-dsa-basics', course_id: '1', title: 'Data Structures & Algorithms Basics', duration_minutes: 15, question_count: 10 },
  { id: 'upsc-gs-1', course_id: '2', title: 'UPSC Prelims GS Mock Test 1', duration_minutes: 20, question_count: 10 },
  { id: 'quant-basics', course_id: '3', title: 'Quantitative Aptitude Diagnostic Test', duration_minutes: 15, question_count: 10 }
];

const { mockDB } = require('../lib/mock-db');
const SEED_QUESTIONS = mockDB.getQuestions('sde-js-react')
  .concat(mockDB.getQuestions('sde-dsa-basics'))
  .concat(mockDB.getQuestions('upsc-gs-1'))
  .concat(mockDB.getQuestions('quant-basics'));

async function createDoc(collectionId, documentId, data) {
  try {
    await databases.createDocument(databaseId, collectionId, documentId, data);
    console.log(`Successfully created document in ${collectionId}: ${documentId}`);
  } catch (err) {
    if (err.code === 409) {
      console.log(`Document ${documentId} in ${collectionId} already exists. Skipping.`);
    } else {
      console.error(`Failed to create document ${documentId} in ${collectionId}:`, err.message);
    }
  }
}

async function runSeed() {
  console.log('\n--- Seeding Courses ---');
  for (const c of SEED_COURSES) {
    const docId = c.id;
    const data = { ...c };
    delete data.id;
    await createDoc(COLLECTIONS.COURSES, docId, data);
  }

  console.log('\n--- Seeding Lessons ---');
  for (const l of SEED_LESSONS) {
    const docId = `lesson_${l.course_id}_${l.order_index}`;
    await createDoc(COLLECTIONS.LESSONS, docId, l);
  }

  console.log('\n--- Seeding Enrollment Codes ---');
  for (const code of SEED_CODES) {
    const docId = `code_${code.code.toLowerCase()}`;
    await createDoc(COLLECTIONS.CODES, docId, code);
  }

  console.log('\n--- Seeding Settings ---');
  for (const s of SEED_SETTINGS) {
    const docId = s.key;
    await createDoc(COLLECTIONS.SETTINGS, docId, s);
  }

  console.log('\n--- Seeding Mock Tests ---');
  for (const mt of SEED_MOCK_TESTS) {
    const docId = mt.id;
    const data = { ...mt };
    delete data.id;
    await createDoc(COLLECTIONS.MOCK_TESTS, docId, data);
  }

  console.log('\n--- Seeding Questions ---');
  for (const q of SEED_QUESTIONS) {
    const docId = `q_${q.id}`;
    const data = { ...q };
    delete data.id;
    await createDoc(COLLECTIONS.QUESTIONS, docId, data);
  }

  console.log('\nDatabase seeding finished!');
}

runSeed();
