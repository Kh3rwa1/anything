/**
 * Shared API response types for IAs Academy.
 * Used by web admin pages and consumed by mobile app via API responses.
 */

import type { LucideIcon } from 'lucide-react-native';

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  category_id: string;
  instructor: string;
  level: string;
  duration: string;
  thumbnail_url: string;
  lesson_count?: number;
  rating?: string;
  tag?: string;
  tagColor?: string;
  sub?: string;
  img?: string;
  students?: string;
  category_name?: string;
}

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  created_at: string;
  title: string;
  instructor: string;
  thumbnail_url: string;
  duration: string;
}

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
  question: string;
  options: string[];
  correct_index: number;
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
  completed_at: string;
  answers?: Record<string, number>;
}

export interface PushToken {
  id: string;
  user_id: string;
  token: string;
  updated_at: string;
}

export interface ApiUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'student';
  image: string;
}

export interface MenuItem {
  icon: LucideIcon;
  label: string;
  color: string;
  bg: string;
}

export interface MenuSection {
  title: string;
  items: MenuItem[];
}
