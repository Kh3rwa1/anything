'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  BookOpen,
  IndianRupee,
  X,
  ChevronDown,
  ChevronRight,
  GripVertical,
  Video,
  FileText,
  Check,
  RefreshCw,
} from 'lucide-react';

interface Course {
  id: number;
  title: string;
  description: string;
  price: string;
  instructor: string;
  level: string;
  duration: string;
  thumbnail_url: string;
  category_id: number;
  category_name: string;
}

interface Lesson {
  id: number;
  course_id: number;
  title: string;
  video_url: string | null;
  content: string | null;
  order_index: number;
}

type CourseForm = {
  title: string;
  description: string;
  price: string;
  instructor: string;
  level: string;
  duration: string;
  thumbnail_url: string;
  category_id: string;
};

const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
const EMPTY_FORM: CourseForm = {
  title: '',
  description: '',
  price: '',
  instructor: '',
  level: 'Beginner',
  duration: '',
  thumbnail_url: '',
  category_id: 'SDE',
};

export default function AdminCourses() {
  const qc = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState<CourseForm>(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [expandedCourse, setExpandedCourse] = useState<number | null>(null);

  // Lesson form state
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonVideo, setLessonVideo] = useState('');
  const [lessonContent, setLessonContent] = useState('');
  const [lessonError, setLessonError] = useState('');
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

  const { data: courses, isLoading, isError } = useQuery<Course[]>({
    queryKey: ['admin-courses'],
    retry: false,
    queryFn: async () => {
      const res = await fetch('/api/courses');
      if (!res.ok) throw new Error('Failed');
      return res.json();
    },
  });

  const { data: lessons } = useQuery<Lesson[]>({
    queryKey: ['admin-lessons', expandedCourse],
    enabled: !!expandedCourse,
    retry: false,
    queryFn: async () => {
      const res = await fetch(`/api/admin/lessons?course_id=${expandedCourse}`);
      if (!res.ok) throw new Error('Failed');
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: CourseForm) => {
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          price: parseFloat(data.price),
          category_id: data.category_id,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed');
      return json;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-courses'] });
      closeModal();
    },
    onError: (e: Error) => setFormError(e.message),
  });

  const updateMutation = useMutation({
    mutationFn: async (data: CourseForm & { id: number }) => {
      const res = await fetch(`/api/admin/courses/${data.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          price: parseFloat(data.price),
          category_id: data.category_id,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed');
      return json;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-courses'] });
      closeModal();
    },
    onError: (e: Error) => setFormError(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/admin/courses/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed');
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-courses'] });
      setDeleteId(null);
    },
  });

  const addLessonMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/admin/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          course_id: expandedCourse,
          title: lessonTitle,
          video_url: lessonVideo,
          content: lessonContent,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed');
      return json;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-lessons', expandedCourse] });
      setLessonTitle('');
      setLessonVideo('');
      setLessonContent('');
      setLessonError('');
    },
    onError: (e: Error) => setLessonError(e.message),
  });

  const updateLessonMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/admin/lessons', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingLesson?.id,
          title: lessonTitle,
          video_url: lessonVideo,
          content: lessonContent,
          order_index: editingLesson?.order_index,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed');
      return json;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-lessons', expandedCourse] });
      setLessonTitle('');
      setLessonVideo('');
      setLessonContent('');
      setLessonError('');
      setEditingLesson(null);
    },
    onError: (e: Error) => setLessonError(e.message),
  });

  const deleteLessonMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch('/api/admin/lessons', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error('Failed');
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-lessons', expandedCourse] }),
  });

  const closeModal = () => {
    setShowModal(false);
    setEditingCourse(null);
    setForm(EMPTY_FORM);
    setFormError('');
  };

  const openEdit = (c: Course) => {
    setEditingCourse(c);
    setForm({
      title: c.title,
      description: c.description || '',
      price: String(c.price),
      instructor: c.instructor,
      level: c.level || 'Beginner',
      duration: c.duration || '',
      thumbnail_url: c.thumbnail_url || '',
      category_id: String(c.category_id),
    });
    setFormError('');
    setShowModal(true);
  };

  const handleSubmit = () => {
    setFormError('');
    if (!form.title || !form.instructor || !form.price) {
      setFormError('Title, instructor and price are required.');
      return;
    }
    if (editingCourse) {
      updateMutation.mutate({ ...form, id: editingCourse.id });
    } else {
      createMutation.mutate(form);
    }
  };

  const handleSaveLesson = () => {
    setLessonError('');
    if (!lessonTitle.trim()) {
      setLessonError('Lesson title is required');
      return;
    }
    if (editingLesson) {
      updateLessonMutation.mutate();
    } else {
      addLessonMutation.mutate();
    }
  };

  const filtered = (courses ?? []).filter(
    (c) =>
      !search ||
      c.title?.toLowerCase().includes(search.toLowerCase()) ||
      c.instructor?.toLowerCase().includes(search.toLowerCase())
  );

  const isPending = createMutation.isPending || updateMutation.isPending;
  const avgPrice =
    courses && courses.length > 0
      ? Math.round(courses.reduce((a, c) => a + Number(c.price), 0) / courses.length)
      : 0;

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">Catalog Management</p>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Courses</h1>
        </div>
        <button
          onClick={() => {
            closeModal();
            setShowModal(true);
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200"
        >
          <Plus className="w-4 h-4" /> Create Course
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: 'Total Courses',
            value: courses?.length ?? '—',
            icon: <BookOpen className="w-4 h-4 text-indigo-600" />,
            bg: 'bg-indigo-50',
          },
          {
            label: 'Total Lessons',
            value: '—',
            icon: <Video className="w-4 h-4 text-violet-600" />,
            bg: 'bg-violet-50',
          },
          {
            label: 'Avg. Price',
            value: `₹${avgPrice.toLocaleString('en-IN')}`,
            icon: <IndianRupee className="w-4 h-4 text-amber-600" />,
            bg: 'bg-amber-50',
          },
        ].map((s, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-slate-200 px-5 py-4 flex items-center gap-4"
          >
            <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center`}>
              {s.icon}
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">{s.label}</p>
              <p className="text-xl font-black text-slate-900">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search courses…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
            />
          </div>
          <p className="text-sm text-slate-500">{filtered.length} courses</p>
        </div>

        <div className="divide-y divide-slate-100">
          {isLoading ? (
            <div className="py-16 text-center text-slate-400 text-sm">Loading…</div>
          ) : isError ? (
            <div className="py-16 text-center">
              <BookOpen className="w-10 h-10 text-slate-200 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">Courses are not connected yet</p>
              <p className="text-sm text-slate-400 mt-1">
                Connect the database and sign in as an admin to manage the catalog.
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center">
              <BookOpen className="w-10 h-10 text-slate-200 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-500">
                No courses yet. Create your first one!
              </p>
            </div>
          ) : (
            filtered.map((course) => {
              const isExpanded = expandedCourse === course.id;
              return (
                <div key={course.id}>
                  {/* Course Row */}
                  <div className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/60 transition-colors group">
                    {/* Expand toggle */}
                    <button
                      onClick={() => setExpandedCourse(isExpanded ? null : course.id)}
                      className="flex-shrink-0 text-slate-400 hover:text-indigo-600 transition-colors"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                    {/* Thumbnail */}
                    <div className="w-12 h-12 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0">
                      {course.thumbnail_url ? (
                        <img
                          src={course.thumbnail_url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <BookOpen className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">{course.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        by {course.instructor} · {course.category_name}
                      </p>
                    </div>
                    {/* Level */}
                    <span
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex-shrink-0 ${course.level === 'Beginner' ? 'bg-emerald-50 text-emerald-700' : course.level === 'Intermediate' ? 'bg-blue-50 text-blue-700' : course.level === 'Advanced' ? 'bg-orange-50 text-orange-700' : 'bg-purple-50 text-purple-700'}`}
                    >
                      {course.level || 'Beginner'}
                    </span>
                    {/* Price */}
                    <span className="text-sm font-bold text-slate-900 flex-shrink-0">
                      ₹{Number(course.price).toLocaleString('en-IN')}
                    </span>
                    {/* Duration */}
                    <span className="text-xs text-slate-500 flex-shrink-0 w-20">
                      {course.duration || 'Self-paced'}
                    </span>
                    {/* Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => openEdit(course)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      {deleteId === course.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => deleteMutation.mutate(course.id)}
                            className="px-2 py-1 text-xs font-bold text-white bg-red-500 rounded-lg hover:bg-red-600"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setDeleteId(null)}
                            className="px-2 py-1 text-xs font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteId(course.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Lessons Panel */}
                  {isExpanded && (
                    <div className="bg-slate-50/70 border-t border-slate-100 px-14 py-5">
                      <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">
                        Lessons
                      </p>
                      {/* Lesson List */}
                      <div className="space-y-2 mb-4">
                        {!lessons || lessons.length === 0 ? (
                          <p className="text-sm text-slate-400 italic">
                            No lessons yet. Add the first one below.
                          </p>
                        ) : (
                          lessons.map((lesson, idx) => (
                            <div
                              key={lesson.id}
                              className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3 group"
                            >
                              <GripVertical className="w-4 h-4 text-slate-300 flex-shrink-0" />
                              <span className="text-xs font-bold text-slate-400 w-5">
                                {idx + 1}
                              </span>
                              {lesson.video_url ? (
                                <Video className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                              ) : (
                                <FileText className="w-4 h-4 text-slate-400 flex-shrink-0" />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-slate-800 truncate">
                                  {lesson.title}
                                </p>
                                {lesson.video_url && (
                                  <p className="text-xs text-slate-400 truncate">
                                    {lesson.video_url}
                                  </p>
                                )}
                              </div>
                              <button
                                onClick={() => {
                                  setEditingLesson(lesson);
                                  setLessonTitle(lesson.title);
                                  setLessonVideo(lesson.video_url || '');
                                  setLessonContent(lesson.content || '');
                                  setLessonError('');
                                }}
                                className="p-1.5 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                title="Edit"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => deleteLessonMutation.mutate(lesson.id)}
                                className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                      {/* Add/Edit Lesson Form */}
                      <div className="bg-white border border-dashed border-slate-300 rounded-xl p-4">
                        <p className="text-xs font-semibold text-slate-500 mb-3">
                          {editingLesson ? 'Edit Lesson' : 'Add New Lesson'}
                        </p>
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <input
                            value={lessonTitle}
                            onChange={(e) => setLessonTitle(e.target.value)}
                            placeholder="Lesson title *"
                            className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
                          />
                          <input
                            value={lessonVideo}
                            onChange={(e) => setLessonVideo(e.target.value)}
                            placeholder="Video URL (optional)"
                            className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
                          />
                        </div>
                        <textarea
                          value={lessonContent}
                          onChange={(e) => setLessonContent(e.target.value)}
                          placeholder="Lesson notes / description (optional)"
                          rows={2}
                          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 resize-none mb-3"
                        />
                        {lessonError && (
                          <p className="text-xs text-red-500 mb-2">⚠ {lessonError}</p>
                        )}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={handleSaveLesson}
                            disabled={addLessonMutation.isPending || updateLessonMutation.isPending}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                          >
                            {addLessonMutation.isPending || updateLessonMutation.isPending ? (
                              <RefreshCw
                                className="w-3.5 h-3.5 animate-spin"
                              />
                            ) : editingLesson ? (
                              <Check className="w-3.5 h-3.5" />
                            ) : (
                              <Plus className="w-3.5 h-3.5" />
                            )}
                            {editingLesson ? 'Save Changes' : 'Add Lesson'}
                          </button>
                          {editingLesson && (
                            <button
                              onClick={() => {
                                setEditingLesson(null);
                                setLessonTitle('');
                                setLessonVideo('');
                                setLessonContent('');
                                setLessonError('');
                              }}
                              className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {editingCourse ? 'Edit Course' : 'Create New Course'}
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  {editingCourse ? 'Update course details' : 'Add a new course to your catalog'}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                  {formError}
                </div>
              )}
              <FieldInput
                label="Course Title *"
                value={form.title}
                onChange={(v) => setForm({ ...form, title: v })}
                placeholder="e.g. Full Stack SDE Bootcamp"
              />
              <FieldInput
                label="Instructor Name *"
                value={form.instructor}
                onChange={(v) => setForm({ ...form, instructor: v })}
                placeholder="e.g. Priya Kapoor"
              />
              <div className="grid grid-cols-2 gap-4">
                <FieldInput
                  label="Price (₹) *"
                  value={form.price}
                  onChange={(v) => setForm({ ...form, price: v })}
                  placeholder="4999"
                  type="number"
                />
                <FieldInput
                  label="Duration"
                  value={form.duration}
                  onChange={(v) => setForm({ ...form, duration: v })}
                  placeholder="e.g. 48h"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Level</label>
                  <select
                    value={form.level}
                    onChange={(e) => setForm({ ...form, level: e.target.value })}
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
                  >
                    {LEVELS.map((l) => (
                      <option key={l}>{l}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Category *</label>
                  <select
                    value={form.category_id}
                    onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
                  >
                    <option value="SDE">SDE Preparation</option>
                    <option value="UPSC">UPSC Civil Services</option>
                    <option value="Aptitude">Placement Aptitude</option>
                  </select>
                </div>
              </div>
              <FieldInput
                label="Thumbnail URL"
                value={form.thumbnail_url}
                onChange={(v) => setForm({ ...form, thumbnail_url: v })}
                placeholder="https://…"
              />
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe the course…"
                  rows={3}
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-slate-100">
              <button
                onClick={closeModal}
                className="flex-1 py-2.5 text-sm font-semibold text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isPending}
                className="flex-1 py-2.5 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <>
                    <RefreshCw
                      className="w-4 h-4"
                      style={{ animation: 'spin 1s linear infinite' }}
                    />{' '}
                    Saving…
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" /> {editingCourse ? 'Save Changes' : 'Create Course'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

function FieldInput({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-700 mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
      />
    </div>
  );
}
