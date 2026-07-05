import fs from 'fs';
import path from 'path';

const DB_FILE = path.join(process.cwd(), 'db', 'mock-db.json');

export interface MockTest {
  id: string;
  course_id: string;
  title: string;
  duration_minutes: number;
  question_count: number;
}

export interface Question {
  id: string;
  test_id: string;
  question_text: string;
  options: string[];
  correct_index: number;
  explanation: string;
}

export interface TestAttempt {
  id: string;
  user_id: string;
  test_id: string;
  course_id: string;
  test_title: string;
  score: number;
  total_questions: number;
  correct_count: number;
  answers: Record<string, number>; // questionId -> selectedIndex
  completed_at: string;
}

export interface PushToken {
  user_id: string;
  token: string;
  updated_at: string;
}

interface MockDBData {
  mockTests: MockTest[];
  questions: Question[];
  testAttempts: TestAttempt[];
  pushTokens: PushToken[];
}

const DEFAULT_DATA: MockDBData = {
  mockTests: [
    {
      id: 'sde-js-react',
      course_id: '1',
      title: 'JavaScript & React Core Concept Test',
      duration_minutes: 15,
      question_count: 10,
    },
    {
      id: 'sde-dsa-basics',
      course_id: '1',
      title: 'Data Structures & Algorithms Basics',
      duration_minutes: 15,
      question_count: 10,
    },
    {
      id: 'upsc-gs-1',
      course_id: '2',
      title: 'UPSC Prelims GS Mock Test 1',
      duration_minutes: 20,
      question_count: 10,
    },
    {
      id: 'quant-basics',
      course_id: '3',
      title: 'Quantitative Aptitude Diagnostic Test',
      duration_minutes: 15,
      question_count: 10,
    }
  ],
  questions: [
    // JavaScript & React Core Concept Test
    {
      id: 'js-q1',
      test_id: 'sde-js-react',
      question_text: 'What is the output of `console.log(typeof null)` in JavaScript?',
      options: ['"null"', '"undefined"', '"object"', '"function"'],
      correct_index: 2,
      explanation: 'In JavaScript, `typeof null` returns "object". This is a long-standing historical bug in the language design, but it remains for backward compatibility.',
    },
    {
      id: 'js-q2',
      test_id: 'sde-js-react',
      question_text: 'Which React hook should you use to memorize a computed value and prevent recalculating it on every render?',
      options: ['useEffect', 'useCallback', 'useMemo', 'useState'],
      correct_index: 2,
      explanation: '`useMemo` returns a memoized value. It recalculates the value only when one of its dependencies changes.',
    },
    {
      id: 'js-q3',
      test_id: 'sde-js-react',
      question_text: 'What does the Event Loop do in JavaScript?',
      options: [
        'Executes async tasks in parallel using worker threads',
        'Monitors the Call Stack and Callback Queue, pushing tasks from queue to stack when empty',
        'Processes DOM manipulations synchronously',
        'Garbage collects unused objects periodically'
      ],
      correct_index: 1,
      explanation: 'The Event Loop continuously checks if the Call Stack is empty. If it is, it takes the first task from the Callback Queue (or Microtask Queue) and pushes it to the Call Stack.',
    },
    {
      id: 'js-q4',
      test_id: 'sde-js-react',
      question_text: 'What is a closure in JavaScript?',
      options: [
        'A way to safely exit a loop execution early',
        'The combination of a function bundled together with references to its surrounding lexical environment',
        'A function that can only be called once',
        'An API endpoint encapsulation block'
      ],
      correct_index: 1,
      explanation: 'A closure gives an inner function access to the outer function\'s scope even after the outer function has returned.',
    },
    {
      id: 'js-q5',
      test_id: 'sde-js-react',
      question_text: 'Which of the following statements about React virtual DOM is CORRECT?',
      options: [
        'It is faster than direct memory manipulations',
        'It directly updates the browser layout on every state change',
        'It is an in-memory representation of the real DOM, which is synced via reconciliation',
        'It disables events propagation by default'
      ],
      correct_index: 2,
      explanation: 'The virtual DOM is a lightweight copy of the real DOM. React uses a reconciliation algorithm (diffing) to find changes and batch-update the real DOM efficiently.',
    },
    {
      id: 'js-q6',
      test_id: 'sde-js-react',
      question_text: 'How does the React Compiler (React 19) affect component re-renders?',
      options: [
        'It automatically memoizes components, hooks, and dependencies, rendering useMemo/useCallback mostly optional',
        'It intercepts state updates and processes them in web workers',
        'It replaces the Virtual DOM completely with direct signals',
        'It disables strict mode checking by default'
      ],
      correct_index: 0,
      explanation: 'React Compiler (React 19) is a build-time tool that automatically optimizes and memoizes elements, eliminating the need for manual `useMemo` and `useCallback` boilerplate in most cases.',
    },
    {
      id: 'js-q7',
      test_id: 'sde-js-react',
      question_text: 'What is the output of `console.log(0.1 + 0.2 === 0.3)` in JavaScript?',
      options: ['true', 'false', 'undefined', 'ReferenceError'],
      correct_index: 1,
      explanation: 'It evaluates to `false` due to floating-point precision limitations in IEEE 754 standard arithmetic (0.1 + 0.2 equals 0.30000000000000004).',
    },
    {
      id: 'js-q8',
      test_id: 'sde-js-react',
      question_text: 'In React, what is the main purpose of passing a unique key prop to list items?',
      options: [
        'To style list items individually',
        'To help React identify which items have changed, been added, or been removed during reconciliation',
        'To enable automatic swipe gestures on list items',
        'To bind event handlers dynamically'
      ],
      correct_index: 1,
      explanation: 'Keys help React identify which items are stable and which have changed, ensuring correct DOM updates and maintaining component state.',
    },
    {
      id: 'js-q9',
      test_id: 'sde-js-react',
      question_text: 'What is the behavior of `Promise.all` if one of the promises rejects?',
      options: [
        'It waits for all other promises to resolve and ignores the rejected one',
        'It rejects immediately with the error of the first promise that rejects',
        'It returns resolved values alongside the error object in an array',
        'It retries the rejected promise three times automatically'
      ],
      correct_index: 1,
      explanation: '`Promise.all` has a "fail-fast" behavior. If any input promise rejects, the returned promise immediately rejects with that rejection reason.',
    },
    {
      id: 'js-q10',
      test_id: 'sde-js-react',
      question_text: 'What is the difference between `useCallback` and `useMemo` hooks?',
      options: [
        'useCallback returns a memoized callback function; useMemo returns a memoized computed value',
        'useCallback is executed during compile-time; useMemo runs at runtime',
        'useCallback can only handle synchronous operations; useMemo handles async functions',
        'useCallback is deprecated in React 19'
      ],
      correct_index: 0,
      explanation: '`useCallback(fn, deps)` is equivalent to `useMemo(() => fn, deps)`. The former memoizes the function instance, while the latter memoizes the return value of invoking the function.',
    },

    // Data Structures & Algorithms Basics
    {
      id: 'dsa-q1',
      test_id: 'sde-dsa-basics',
      question_text: 'What is the average time complexity of searching for an element in a balanced Binary Search Tree (BST)?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
      correct_index: 1,
      explanation: 'In a balanced BST, each comparison discards half of the remaining elements, yielding a time complexity of O(log n).',
    },
    {
      id: 'dsa-q2',
      test_id: 'sde-dsa-basics',
      question_text: 'Which data structure operates on a Last-In, First-Out (LIFO) basis?',
      options: ['Queue', 'Stack', 'Linked List', 'Heap'],
      correct_index: 1,
      explanation: 'A Stack is a LIFO (Last-In, First-Out) data structure where elements are pushed and popped from the same end.',
    },
    {
      id: 'dsa-q3',
      test_id: 'sde-dsa-basics',
      question_text: 'What is the space complexity of Mergesort in the worst case?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n^2)'],
      correct_index: 2,
      explanation: 'Mergesort requires an auxiliary array of size O(n) to merge subarrays during sorting, making its space complexity O(n).',
    },
    {
      id: 'dsa-q4',
      test_id: 'sde-dsa-basics',
      question_text: 'Which algorithm is typically used to find the shortest path in a weighted graph with no negative edge weights?',
      options: ['Kruskal\'s Algorithm', 'Prim\'s Algorithm', 'Dijkstra\'s Algorithm', 'Floyd-Warshall Algorithm'],
      correct_index: 2,
      explanation: 'Dijkstra\'s algorithm is a greedy search algorithm that finds the single-source shortest path in a weighted graph without negative weights.',
    },
    {
      id: 'dsa-q5',
      test_id: 'sde-dsa-basics',
      question_text: 'What does a Hash Collision refer to?',
      options: [
        'When the hash table runs out of memory slots',
        'When two different keys produce the same hash code/index',
        'When an encryption handshake fails',
        'When key-lookup takes O(n log n) time'
      ],
      correct_index: 1,
      explanation: 'A collision occurs when a hash function maps two distinct input keys to the same table bucket index.',
    },
    {
      id: 'dsa-q6',
      test_id: 'sde-dsa-basics',
      question_text: 'What is the worst-case time complexity of Quick Sort?',
      options: ['O(n)', 'O(n log n)', 'O(n^2)', 'O(2^n)'],
      correct_index: 2,
      explanation: 'In the worst case (e.g. sorted arrays when choosing pivot poorly), Quick Sort splits array size into 1 and n-1, leading to O(n^2) runtime.',
    },
    {
      id: 'dsa-q7',
      test_id: 'sde-dsa-basics',
      question_text: 'Which tree traversal visits nodes in the order: Left, Right, Root?',
      options: ['Pre-order', 'In-order', 'Post-order', 'Level-order'],
      correct_index: 2,
      explanation: 'Post-order traversal recursively visits left, right children, and then processes the parent/root node last.',
    },
    {
      id: 'dsa-q8',
      test_id: 'sde-dsa-basics',
      question_text: 'What is the primary advantage of a Doubly Linked List over a Singly Linked List?',
      options: [
        'It uses half the memory space',
        'It allows traversal in both forward and backward directions',
        'It provides random index lookup in O(1) time',
        'It keeps elements sorted automatically'
      ],
      correct_index: 1,
      explanation: 'A Doubly Linked List maintains pointers to both next and previous nodes, permitting bidirectional traversal at the expense of extra memory overhead.',
    },
    {
      id: 'dsa-q9',
      test_id: 'sde-dsa-basics',
      question_text: 'Which data structure is best suited to implement Breadth-First Search (BFS)?',
      options: ['Stack', 'Queue', 'Priority Queue', 'Trie'],
      correct_index: 1,
      explanation: 'BFS explores graph levels sequentially, requiring a FIFO Queue to track neighbors for visiting next.',
    },
    {
      id: 'dsa-q10',
      test_id: 'sde-dsa-basics',
      question_text: 'What is the worst-case time complexity of retrieving an element from a Hash Map (assuming collision resolution via chaining)?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(1) average, O(n) worst case'],
      correct_index: 3,
      explanation: 'If all keys hash to the same bucket, lookup degrades to scanning a linked list of length n, which takes O(n) in the worst case.',
    },

    // UPSC GS Mock
    {
      id: 'upsc-q1',
      test_id: 'upsc-gs-1',
      question_text: 'Under which Article of the Indian Constitution can the President declare a Financial Emergency?',
      options: ['Article 352', 'Article 356', 'Article 360', 'Article 368'],
      correct_index: 2,
      explanation: 'Article 360 authorizes the President to declare a financial emergency if the financial stability or credit of India is threatened.',
    },
    {
      id: 'upsc-q2',
      test_id: 'upsc-gs-1',
      question_text: 'The famous "Poona Pact" (1932) was signed between Mahatma Gandhi and who?',
      options: ['Subhas Chandra Bose', 'Dr. B.R. Ambedkar', 'Jawaharlal Nehru', 'Muhammad Ali Jinnah'],
      correct_index: 1,
      explanation: 'The Poona Pact was signed by B.R. Ambedkar and Mahatma Gandhi in 1932 to secure reserved legislative seats for the depressed classes.',
    },
    {
      id: 'upsc-q3',
      test_id: 'upsc-gs-1',
      question_text: 'Which is the longest river flowing entirely inside India?',
      options: ['Ganga', 'Godavari', 'Krishna', 'Yamuna'],
      correct_index: 0,
      explanation: 'The Ganga is the longest river flowing through India (approx 2,525 km), rising in Uttarakhand and emptying into the Bay of Bengal.',
    },
    {
      id: 'upsc-q4',
      test_id: 'upsc-gs-1',
      question_text: 'The concept of "Directive Principles of State Policy" (DPSP) in the Indian Constitution is borrowed from which country?',
      options: ['USA', 'Ireland', 'UK', 'Australia'],
      correct_index: 1,
      explanation: 'Directive Principles (Part IV of the Constitution) are inspired by the Irish Constitution.',
    },
    {
      id: 'upsc-q5',
      test_id: 'upsc-gs-1',
      question_text: 'Which of the following ports is known as the "Queen of the Arabian Sea"?',
      options: ['Mumbai Port', 'Kochi Port', 'Chennai Port', 'Kandla Port'],
      correct_index: 1,
      explanation: 'Kochi (Cochin) Port has been a major trade center for spices for centuries and is called the Queen of the Arabian Sea.',
    },
    {
      id: 'upsc-q6',
      test_id: 'upsc-gs-1',
      question_text: 'Who was the first Viceroy of British India?',
      options: ['Lord Warren Hastings', 'Lord William Bentinck', 'Lord Canning', 'Lord Mountbatten'],
      correct_index: 2,
      explanation: 'Lord Canning became the first Viceroy of India under the Government of India Act 1858, following the rebellion of 1857.',
    },
    {
      id: 'upsc-q7',
      test_id: 'upsc-gs-1',
      question_text: 'Which authority conducts elections to local municipal bodies and Panchayats in India?',
      options: ['Election Commission of India', 'State Election Commission', 'Governor of the State', 'Ministry of Home Affairs'],
      correct_index: 1,
      explanation: 'Under Articles 243K and 243ZA, the State Election Commission is solely responsible for municipal and local body elections.',
    },
    {
      id: 'upsc-q8',
      test_id: 'upsc-gs-1',
      question_text: 'Which layer of the atmosphere contains the ozone layer which filters UV rays?',
      options: ['Troposphere', 'Stratosphere', 'Mesosphere', 'Thermosphere'],
      correct_index: 1,
      explanation: 'The ozone layer lies in the lower Stratosphere (approx 15-35 km altitude), absorbing harmful ultraviolet radiation.',
    },
    {
      id: 'upsc-q9',
      test_id: 'upsc-gs-1',
      question_text: 'The "Preamble" to the Indian Constitution declares India as a:',
      options: [
        'Sovereign, Democratic, Republic',
        'Sovereign, Socialist, Secular, Democratic, Republic',
        'Federal, Socialist, Democratic, Republic',
        'Secular, Democratic, Parliamentary State'
      ],
      correct_index: 1,
      explanation: 'The Preamble defines India as a "Sovereign, Socialist, Secular, Democratic, Republic" (secular and socialist were added in the 42nd Amendment).',
    },
    {
      id: 'upsc-q10',
      test_id: 'upsc-gs-1',
      question_text: 'Who chaired the Drafting Committee of the Indian Constitution?',
      options: ['Dr. Rajendra Prasad', 'Dr. B.R. Ambedkar', 'Sardar Vallabhbhai Patel', 'Jawaharlal Nehru'],
      correct_index: 1,
      explanation: 'Dr. B.R. Ambedkar was the chairman of the Drafting Committee and is considered the Father of the Indian Constitution.',
    },

    // Quantitative Aptitude Diagnostic
    {
      id: 'quant-q1',
      test_id: 'quant-basics',
      question_text: 'If A can complete a work in 10 days and B can do it in 15 days, how many days will they take to finish it working together?',
      options: ['5 days', '6 days', '7 days', '8 days'],
      correct_index: 1,
      explanation: 'Together they complete (1/10 + 1/15) = 5/30 = 1/6 of work per day. Hence, they take 6 days.',
    },
    {
      id: 'quant-q2',
      test_id: 'quant-basics',
      question_text: 'A dealer buys an article for ₹800 and sells it for ₹1000. What is his profit percentage?',
      options: ['20%', '25%', '30%', '15%'],
      correct_index: 1,
      explanation: 'Profit = Selling Price - Cost Price = 1000 - 800 = 200. Profit % = (200 / 800) * 100 = 25%.',
    },
    {
      id: 'quant-q3',
      test_id: 'quant-basics',
      question_text: 'What is the probability of rolling a sum of 7 when rolling two fair 6-sided dice?',
      options: ['1/6', '1/12', '5/36', '1/36'],
      correct_index: 0,
      explanation: 'Favorable pairs for sum 7: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) — 6 outcomes. Total outcomes = 36. Probability = 6/36 = 1/6.',
    },
    {
      id: 'quant-q4',
      test_id: 'quant-basics',
      question_text: 'The ratio of ages of Ram and Shyam is 3:4. If the sum of their ages is 28, what is Shyam\'s age?',
      options: ['12 years', '16 years', '18 years', '20 years'],
      correct_index: 1,
      explanation: 'Let ages be 3x and 4x. 3x + 4x = 28 => 7x = 28 => x = 4. Shyam\'s age = 4x = 16 years.',
    },
    {
      id: 'quant-q5',
      test_id: 'quant-basics',
      question_text: 'A train 120m long passes a pole in 6 seconds. What is the speed of the train in km/h?',
      options: ['50 km/h', '60 km/h', '72 km/h', '80 km/h'],
      correct_index: 2,
      explanation: 'Speed = Distance / Time = 120m / 6s = 20 m/s. To convert to km/h: 20 * 18/5 = 72 km/h.',
    },
    {
      id: 'quant-q6',
      test_id: 'quant-basics',
      question_text: 'What is the sum of the first 20 positive odd integers?',
      options: ['200', '380', '400', '420'],
      correct_index: 2,
      explanation: 'The sum of the first n odd numbers is always n^2. For n=20, 20^2 = 400.',
    },
    {
      id: 'quant-q7',
      test_id: 'quant-basics',
      question_text: 'A sum of money doubles itself in 8 years at simple interest. What is the annual interest rate?',
      options: ['10%', '12.5%', '15%', '8%'],
      correct_index: 1,
      explanation: 'Double sum means simple interest earned equals principal P. SI = P * R * T / 100 => P = P * R * 8 / 100 => R = 100 / 8 = 12.5%.',
    },
    {
      id: 'quant-q8',
      test_id: 'quant-basics',
      question_text: 'Find the greatest number that divides 43, 91 and 183 leaving the same remainder in each case.',
      options: ['4', '7', '9', '13'],
      correct_index: 0,
      explanation: 'Greatest number is HCF of difference between numbers: HCF(|91-43|, |183-91|, |183-43|) = HCF(48, 92, 140) = 4.',
    },
    {
      id: 'quant-q9',
      test_id: 'quant-basics',
      question_text: 'Average of 5 consecutive numbers is 20. What is the largest of these numbers?',
      options: ['20', '22', '24', '25'],
      correct_index: 1,
      explanation: 'Let consecutive numbers be x-2, x-1, x, x+1, x+2. The average is x = 20. The largest number is x+2 = 22.',
    },
    {
      id: 'quant-q10',
      test_id: 'quant-basics',
      question_text: 'The price of sugar rises by 25%. By how much percent must a family reduce sugar consumption to keep expenses constant?',
      options: ['25%', '20%', '15%', '16.66%'],
      correct_index: 1,
      explanation: 'Reduction % = (r / (100 + r)) * 100 = (25 / 125) * 100 = 20%.',
    }
  ],
  testAttempts: [],
  pushTokens: []
};

// Ensures DB file exists and loads it
function readDB(): MockDBData {
  const dir = path.dirname(DB_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_DATA, null, 2));
    return DEFAULT_DATA;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse mock DB JSON, returning default data', err);
    return DEFAULT_DATA;
  }
}

function writeDB(data: MockDBData) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Failed to write mock DB JSON', err);
  }
}

export const mockDB = {
  getMockTests(courseId?: string): MockTest[] {
    const data = readDB();
    if (courseId) {
      return data.mockTests.filter(t => String(t.course_id) === String(courseId));
    }
    return data.mockTests;
  },

  getMockTest(testId: string): MockTest | undefined {
    const data = readDB();
    return data.mockTests.find(t => t.id === testId);
  },

  getQuestions(testId: string): Question[] {
    const data = readDB();
    return data.questions.filter(q => q.test_id === testId);
  },

  saveAttempt(attempt: Omit<TestAttempt, 'id' | 'completed_at'>): TestAttempt {
    const data = readDB();
    const newAttempt: TestAttempt = {
      ...attempt,
      id: `attempt_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      completed_at: new Date().toISOString(),
    };
    data.testAttempts.push(newAttempt);
    writeDB(data);
    return newAttempt;
  },

  getAttempts(userId: string, courseId?: string): TestAttempt[] {
    const data = readDB();
    let userAttempts = data.testAttempts.filter(a => a.user_id === userId);
    if (courseId) {
      userAttempts = userAttempts.filter(a => String(a.course_id) === String(courseId));
    }
    return userAttempts.sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime());
  },

  getAllAttempts(userId: string): TestAttempt[] {
    const data = readDB();
    return data.testAttempts.filter(a => a.user_id === userId);
  },

  registerPushToken(userId: string, token: string): PushToken {
    const data = readDB();
    const existing = data.pushTokens.find(pt => pt.user_id === userId);
    const now = new Date().toISOString();
    if (existing) {
      existing.token = token;
      existing.updated_at = now;
    } else {
      data.pushTokens.push({
        user_id: userId,
        token,
        updated_at: now
      });
    }
    writeDB(data);
    return existing || data.pushTokens[data.pushTokens.length - 1];
  },

  getPushTokens(): string[] {
    const data = readDB();
    return data.pushTokens.map(pt => pt.token);
  },

  // Admin capabilities
  createMockTest(test: MockTest): MockTest {
    const data = readDB();
    data.mockTests.push(test);
    writeDB(data);
    return test;
  },

  updateMockTest(testId: string, test: Partial<MockTest>): MockTest {
    const data = readDB();
    const idx = data.mockTests.findIndex(t => t.id === testId);
    if (idx === -1) throw new Error('Mock test not found');
    data.mockTests[idx] = { ...data.mockTests[idx], ...test };
    writeDB(data);
    return data.mockTests[idx];
  },

  deleteMockTest(testId: string) {
    const data = readDB();
    data.mockTests = data.mockTests.filter(t => t.id !== testId);
    data.questions = data.questions.filter(q => q.test_id !== testId);
    writeDB(data);
  },

  createQuestion(question: Question): Question {
    const data = readDB();
    data.questions.push(question);
    // Update question count in test
    const test = data.mockTests.find(t => t.id === question.test_id);
    if (test) {
      test.question_count = data.questions.filter(q => q.test_id === question.test_id).length;
    }
    writeDB(data);
    return question;
  },

  deleteQuestion(questionId: string) {
    const data = readDB();
    const q = data.questions.find(item => item.id === questionId);
    if (q) {
      data.questions = data.questions.filter(item => item.id !== questionId);
      const test = data.mockTests.find(t => t.id === q.test_id);
      if (test) {
        test.question_count = data.questions.filter(item => item.test_id === q.test_id).length;
      }
      writeDB(data);
    }
  }
};
