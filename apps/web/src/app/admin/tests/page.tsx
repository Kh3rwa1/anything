'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  Trash2,
  BookOpen,
  HelpCircle,
  Clock,
  ChevronRight,
  ChevronDown,
  Edit2,
  X,
  PlusCircle,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';

interface Course {
  id: string;
  title: string;
}

interface MockTest {
  id: string;
  course_id: string;
  title: string;
  duration_minutes: number;
  question_count: number;
}

interface Question {
  id: string;
  test_id: string;
  question_text: string;
  options: string[];
  correct_index: number;
  explanation: string;
}

export default function AdminTestsPage() {
  const qc = useQueryClient();
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [expandedTest, setExpandedTest] = useState<string | null>(null);

  // Form states for test creation/editing
  const [editingTest, setEditingTest] = useState<MockTest | null>(null);
  const [showTestModal, setShowTestModal] = useState(false);
  const [testTitle, setTestTitle] = useState('');
  const [testDuration, setTestDuration] = useState(15);
  const [testCourseId, setTestCourseId] = useState('1');

  // Form states for question creation
  const [qText, setQText] = useState('');
  const [qOptions, setQOptions] = useState<string[]>(['', '', '', '']);
  const [qCorrect, setQCorrect] = useState<number>(0);
  const [qExplanation, setQExplanation] = useState('');

  // Fetch courses
  const { data: courses = [] } = useQuery<Course[]>({
    queryKey: ['admin-courses-list'],
    queryFn: async () => {
      const res = await fetch('/api/courses');
      if (!res.ok) throw new Error();
      const list = await res.json();
      return list.map((c: any) => ({ id: String(c.id), title: c.title }));
    },
  });

  // Fetch mock tests
  const { data: tests = [], isLoading: testsLoading } = useQuery<MockTest[]>({
    queryKey: ['admin-tests'],
    queryFn: async () => {
      const res = await fetch('/api/courses/tests?course_id=all');
      if (!res.ok) throw new Error();
      return res.json();
    },
  });

  // Fetch questions for expanded test
  const { data: questions = [], isLoading: questionsLoading } = useQuery<Question[]>({
    queryKey: ['admin-questions', expandedTest],
    enabled: !!expandedTest,
    queryFn: async () => {
      const res = await fetch(`/api/courses/tests/questions?test_id=${expandedTest}&review=true`);
      if (!res.ok) throw new Error();
      return res.json();
    },
  });

  // Test mutations
  const createTestMutation = useMutation({
    mutationFn: async (data: Omit<MockTest, 'id' | 'question_count'>) => {
      const id = 'test_' + Date.now();
      // Since mock-db is local, we just put/post to admin endpoints or use tests/route or mock-db directly if possible.
      // But we can create a simple POST endpoint or perform local client updates.
      // Let's create an admin tests API route to handle CRUD! Wait, we should implement a POST/DELETE method in `api/courses/tests/route.ts` or make an admin endpoint.
      // Let's implement it inside `api/courses/tests/route.ts` as POST/DELETE too, so the admin page can easily query it!
      const res = await fetch('/api/courses/tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...data }),
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-tests'] });
      toast.success('Mock test created successfully');
      setShowTestModal(false);
      resetTestForm();
    },
    onError: (err: any) => {
      toast.error('Failed to create test: ' + err.message);
    },
  });

  const updateTestMutation = useMutation({
    mutationFn: async (data: MockTest) => {
      const res = await fetch('/api/courses/tests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-tests'] });
      toast.success('Mock test updated successfully');
      setShowTestModal(false);
      resetTestForm();
    },
  });

  const deleteTestMutation = useMutation({
    mutationFn: async (testId: string) => {
      const res = await fetch('/api/courses/tests', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testId }),
      });
      if (!res.ok) throw new Error();
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-tests'] });
      toast.success('Mock test deleted');
      if (expandedTest) setExpandedTest(null);
    },
  });

  // Question mutations
  const createQuestionMutation = useMutation({
    mutationFn: async (data: Omit<Question, 'id'>) => {
      const res = await fetch('/api/courses/tests/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-questions', expandedTest] });
      qc.invalidateQueries({ queryKey: ['admin-tests'] });
      toast.success('Question added successfully');
      resetQuestionForm();
    },
  });

  const deleteQuestionMutation = useMutation({
    mutationFn: async (qId: string) => {
      const res = await fetch('/api/courses/tests/questions', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId: qId }),
      });
      if (!res.ok) throw new Error();
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-questions', expandedTest] });
      qc.invalidateQueries({ queryKey: ['admin-tests'] });
      toast.success('Question deleted');
    },
  });

  const resetTestForm = () => {
    setTestTitle('');
    setTestDuration(15);
    setTestCourseId('1');
    setEditingTest(null);
  };

  const resetQuestionForm = () => {
    setQText('');
    setQOptions(['', '', '', '']);
    setQCorrect(0);
    setQExplanation('');
  };

  const handleSaveTest = () => {
    if (!testTitle.trim()) {
      toast.error('Title is required');
      return;
    }
    if (editingTest) {
      updateTestMutation.mutate({
        ...editingTest,
        title: testTitle,
        duration_minutes: Number(testDuration),
        course_id: testCourseId,
      });
    } else {
      createTestMutation.mutate({
        title: testTitle,
        duration_minutes: Number(testDuration),
        course_id: testCourseId,
      });
    }
  };

  const handleAddQuestion = () => {
    if (!expandedTest) return;
    if (!qText.trim()) {
      toast.error('Question text is required');
      return;
    }
    if (qOptions.some(opt => !opt.trim())) {
      toast.error('All 4 options must be filled');
      return;
    }
    createQuestionMutation.mutate({
      test_id: expandedTest,
      question_text: qText,
      options: qOptions,
      correct_index: qCorrect,
      explanation: qExplanation,
    });
  };

  const filteredTests = selectedCourse === 'all'
    ? tests
    : tests.filter(t => String(t.course_id) === String(selectedCourse));

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Mock Tests Management</h1>
          <p className="text-sm text-slate-500 mt-1">Configure diagnostic quizzes and mock tests for courses.</p>
        </div>
        <button
          onClick={() => {
            resetTestForm();
            setShowTestModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          Create Mock Test
        </button>
      </div>

      {/* Filter and Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar/Filters & Test List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Filter by Course
            </label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="all">All Courses</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-sm font-bold text-slate-700">Mock Tests ({filteredTests.length})</h2>
            </div>
            {testsLoading ? (
              <div className="p-8 text-center text-slate-400 text-sm">Loading tests...</div>
            ) : filteredTests.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm italic">No mock tests found.</div>
            ) : (
              <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
                {filteredTests.map(test => {
                  const isExpanded = expandedTest === test.id;
                  const cTitle = courses.find(c => c.id === String(test.course_id))?.title || 'Unknown Course';
                  return (
                    <div
                      key={test.id}
                      className={`p-4 hover:bg-slate-50/50 transition-colors cursor-pointer ${isExpanded ? 'bg-indigo-50/20 border-l-4 border-indigo-600' : ''}`}
                      onClick={() => setExpandedTest(isExpanded ? null : test.id)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-indigo-600 mb-1 truncate">{cTitle}</p>
                          <p className="text-sm font-bold text-slate-800">{test.title}</p>
                          <div className="flex items-center gap-4 text-xs text-slate-400 mt-2">
                            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {test.duration_minutes}m</span>
                            <span className="flex items-center gap-1"><HelpCircle className="w-3.5 h-3.5" /> {test.question_count} Qs</span>
                          </div>
                        </div>
                        <div className="flex gap-1 flex-shrink-0" onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => {
                              setEditingTest(test);
                              setTestTitle(test.title);
                              setTestDuration(test.duration_minutes);
                              setTestCourseId(test.course_id);
                              setShowTestModal(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-all"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Delete this mock test and all its questions?')) {
                                deleteTestMutation.mutate(test.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Questions Editor */}
        <div className="lg:col-span-2 space-y-6">
          {expandedTest ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Test Details</span>
                  <h2 className="text-lg font-bold text-slate-900 mt-1">
                    {tests.find(t => t.id === expandedTest)?.title}
                  </h2>
                </div>
                <button
                  onClick={() => setExpandedTest(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Questions List */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-800">Questions List</h3>
                {questionsLoading ? (
                  <div className="p-8 text-center text-slate-400 text-sm">Loading questions...</div>
                ) : questions.length === 0 ? (
                  <p className="text-sm text-slate-400 italic">No questions added yet. Add one below.</p>
                ) : (
                  <div className="space-y-3">
                    {questions.map((q, idx) => (
                      <div key={q.id} className="border border-slate-150 rounded-xl p-4 bg-slate-50/30 group relative">
                        <button
                          onClick={() => deleteQuestionMutation.mutate(q.id)}
                          className="absolute top-4 right-4 p-1.5 text-slate-350 hover:text-red-600 rounded-lg hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                          title="Delete question"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <p className="text-sm font-bold text-slate-800 pr-8">
                          Q{idx + 1}. {q.question_text}
                        </p>
                        <div className="grid grid-cols-2 gap-2 mt-3 pl-4">
                          {q.options.map((opt, oIdx) => (
                            <div
                              key={oIdx}
                              className={`text-xs px-3 py-2 rounded-lg flex items-center gap-2 ${
                                oIdx === q.correct_index
                                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold'
                                  : 'bg-white border border-slate-100 text-slate-600'
                              }`}
                            >
                              <span className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center font-bold text-[9px] text-slate-500">
                                {String.fromCharCode(65 + oIdx)}
                              </span>
                              {opt}
                            </div>
                          ))}
                        </div>
                        {q.explanation && (
                          <div className="mt-3 text-xs bg-indigo-50/30 border border-indigo-100/50 rounded-lg p-3 text-slate-550 pl-4">
                            <span className="font-bold text-indigo-700 block mb-1">Explanation:</span>
                            {q.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add Question Form */}
              <div className="bg-slate-50/50 border border-dashed border-slate-300 rounded-2xl p-5 space-y-4">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <PlusCircle className="w-4 h-4 text-indigo-600" /> Add New Question
                </h4>
                <div className="space-y-3">
                  <textarea
                    value={qText}
                    onChange={e => setQText(e.target.value)}
                    placeholder="Enter question text *"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 min-h-[80px]"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    {qOptions.map((opt, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <label className="text-xs font-semibold text-slate-400 uppercase w-4 text-center">
                          {String.fromCharCode(65 + idx)}
                        </label>
                        <input
                          value={opt}
                          onChange={e => {
                            const clone = [...qOptions];
                            clone[idx] = e.target.value;
                            setQOptions(clone);
                          }}
                          placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                          className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                        Correct Option *
                      </label>
                      <select
                        value={qCorrect}
                        onChange={e => setQCorrect(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
                      >
                        <option value={0}>Option A</option>
                        <option value={1}>Option B</option>
                        <option value={2}>Option C</option>
                        <option value={3}>Option D</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                      Explanation (optional)
                    </label>
                    <textarea
                      value={qExplanation}
                      onChange={e => setQExplanation(e.target.value)}
                      placeholder="Explain why the correct option is correct..."
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 min-h-[60px]"
                    />
                  </div>
                  <button
                    onClick={handleAddQuestion}
                    className="w-full py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 shadow-sm transition-all"
                  >
                    Add Question to Test
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-12 text-center text-slate-400">
              <HelpCircle className="w-12 h-12 mx-auto text-slate-350 mb-3" />
              <h3 className="font-bold text-slate-700">No test selected</h3>
              <p className="text-sm text-slate-450 mt-1 max-w-md mx-auto">
                Select a mock test from the list on the left to edit its questions or add new ones.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Test Modal */}
      {showTestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-2xl p-6 relative">
            <button
              onClick={() => setShowTestModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-lg font-bold text-slate-950 mb-4">
              {editingTest ? 'Edit Mock Test' : 'Create Mock Test'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Test Title *
                </label>
                <input
                  value={testTitle}
                  onChange={e => setTestTitle(e.target.value)}
                  placeholder="e.g. JavaScript Advanced Quiz"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    value={testDuration}
                    onChange={e => setTestDuration(Number(e.target.value))}
                    min={1}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                    Course Target
                  </label>
                  <select
                    value={testCourseId}
                    onChange={e => setTestCourseId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowTestModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveTest}
                  className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-all"
                >
                  {editingTest ? 'Update Test' : 'Create Test'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
