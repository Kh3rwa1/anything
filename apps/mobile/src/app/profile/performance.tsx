import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  useWindowDimensions,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Award, CheckCircle2, TrendingUp, BarChart2, ChevronRight, BookOpen } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { api } from '@/utils/api';
import { themeStyle } from '@/utils/theme';

// reactive W defined inside component

interface ProgressionPoint {
  test_title: string;
  score: number;
  date: string;
}

interface PerformanceStats {
  totalAttempts: number;
  averageScore: number;
  highestScore: number;
  accuracyRate: number;
  progression: ProgressionPoint[];
  categoryBreakdown: Record<string, { total: number; average: number }>;
}

export default function PerformanceDashboard() {
  const { width: W } = useWindowDimensions();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  // Query performance stats from API
  const { data: stats, isLoading } = useQuery<PerformanceStats>({
    queryKey: ['performance-stats'],
    queryFn: () => api('/api/students/performance'),
  });

  // Query attempts history for details
  const { data: attempts = [] } = useQuery<any[]>({
    queryKey: ['attempts-history'],
    queryFn: () => api('/api/courses/tests/attempts?course_id=all'),
  });

  useEffect(() => {
    if (!isLoading && stats) {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.spring(slideAnim, { toValue: 0, tension: 80, friction: 10, useNativeDriver: true }),
      ]).start();
    }
  }, [isLoading, stats]);

  if (isLoading) {
    return (
      <View style={themeStyle({ flex: 1, backgroundColor: '#0A0A0F', justifyContent: 'center', alignItems: 'center' })}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={themeStyle({ fontWeight: '600', fontSize: 13, color: '#64748B', marginTop: 12 })}>
          Analyzing your performance...
        </Text>
      </View>
    );
  }

  const hasStats = stats && stats.totalAttempts > 0;

  return (
    <View style={themeStyle({ flex: 1, backgroundColor: '#0A0A0F', paddingTop: insets.top })}>
      <StatusBar style="light" />

      {/* Header bar */}
      <View style={themeStyle({ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#1E1B4B' })}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={themeStyle({ width: 36, height: 36, borderRadius: 18, backgroundColor: '#1A1A2E', alignItems: 'center', justifyContent: 'center', marginRight: 12 })}
        >
          <ArrowLeft size={16} color="#A5B4FC" />
        </TouchableOpacity>
        <Text style={themeStyle({ fontWeight: '800', fontSize: 18, color: '#FFFFFF' })}>
          Performance Reports
        </Text>
      </View>

      {!hasStats ? (
        <View style={themeStyle({ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 })}>
          <Text style={themeStyle({ fontSize: 60, marginBottom: 16 })}>📊</Text>
          <Text style={themeStyle({ fontWeight: '700', fontSize: 18, color: '#FFFFFF', marginBottom: 6, textAlign: 'center' })}>
            No diagnostic data yet
          </Text>
          <Text style={themeStyle({ fontWeight: '400', fontSize: 13, color: '#64748B', textAlign: 'center', lineHeight: 18 })}>
            Complete mock tests and syllabus quizzes under your courses to generate comprehensive analytical breakdowns here.
          </Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 60 }}
        >
          <Animated.View style={themeStyle({ opacity: fadeAnim, transform: [{ translateY: slideAnim }] })}>
            
            {/* Overview Stats Row */}
            <View style={themeStyle({ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 })}>
              {/* Stat Card 1 */}
              <View style={themeStyle({ width: (W - 52) / 2, backgroundColor: '#1A1A2E', borderRadius: 18, padding: 14, borderColor: '#2D2D4E', borderWidth: 1 })}>
                <View style={themeStyle({ width: 28, height: 28, borderRadius: 8, backgroundColor: 'rgba(79,70,229,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 10 })}>
                  <TrendingUp size={14} color="#818CF8" />
                </View>
                <Text style={themeStyle({ fontWeight: '800', fontSize: 20, color: '#FFFFFF' })}>{stats.averageScore}%</Text>
                <Text style={themeStyle({ fontWeight: '500', fontSize: 10, color: '#4B5563', textTransform: 'uppercase', marginTop: 4 })}>Average Score</Text>
              </View>

              {/* Stat Card 2 */}
              <View style={themeStyle({ width: (W - 52) / 2, backgroundColor: '#1A1A2E', borderRadius: 18, padding: 14, borderColor: '#2D2D4E', borderWidth: 1 })}>
                <View style={themeStyle({ width: 28, height: 28, borderRadius: 8, backgroundColor: 'rgba(16,185,129,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 10 })}>
                  <CheckCircle2 size={14} color="#10B981" />
                </View>
                <Text style={themeStyle({ fontWeight: '800', fontSize: 20, color: '#FFFFFF' })}>{stats.accuracyRate}%</Text>
                <Text style={themeStyle({ fontWeight: '500', fontSize: 10, color: '#4B5563', textTransform: 'uppercase', marginTop: 4 })}>Accuracy Rate</Text>
              </View>

              {/* Stat Card 3 */}
              <View style={themeStyle({ width: (W - 52) / 2, backgroundColor: '#1A1A2E', borderRadius: 18, padding: 14, borderColor: '#2D2D4E', borderWidth: 1 })}>
                <View style={themeStyle({ width: 28, height: 28, borderRadius: 8, backgroundColor: 'rgba(245,158,11,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 10 })}>
                  <Award size={14} color="#F59E0B" />
                </View>
                <Text style={themeStyle({ fontWeight: '800', fontSize: 20, color: '#FFFFFF' })}>{stats.highestScore}%</Text>
                <Text style={themeStyle({ fontWeight: '500', fontSize: 10, color: '#4B5563', textTransform: 'uppercase', marginTop: 4 })}>Highest Score</Text>
              </View>

              {/* Stat Card 4 */}
              <View style={themeStyle({ width: (W - 52) / 2, backgroundColor: '#1A1A2E', borderRadius: 18, padding: 14, borderColor: '#2D2D4E', borderWidth: 1 })}>
                <View style={themeStyle({ width: 28, height: 28, borderRadius: 8, backgroundColor: 'rgba(239,68,68,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 10 })}>
                  <BookOpen size={14} color="#EF4444" />
                </View>
                <Text style={themeStyle({ fontWeight: '800', fontSize: 20, color: '#FFFFFF' })}>{stats.totalAttempts}</Text>
                <Text style={themeStyle({ fontWeight: '500', fontSize: 10, color: '#4B5563', textTransform: 'uppercase', marginTop: 4 })}>Total Attempts</Text>
              </View>
            </View>

            {/* Subject/Topic Breakdown */}
            <Text style={themeStyle({ fontWeight: '800', fontSize: 15, color: '#FFFFFF', marginBottom: 14 })}>
              Category Benchmarks
            </Text>
            <View style={themeStyle({ backgroundColor: '#1A1A2E', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#2D2D4E', marginBottom: 24, gap: 16 })}>
              {Object.entries(stats.categoryBreakdown).map(([category, details]) => (
                <View key={category}>
                  <View style={themeStyle({ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 })}>
                    <Text style={themeStyle({ fontWeight: '700', fontSize: 13, color: '#CBD5E1', textTransform: 'capitalize' })}>{category}</Text>
                    <Text style={themeStyle({ fontWeight: '700', fontSize: 13, color: '#818CF8' })}>{details.average}% avg</Text>
                  </View>
                  <View style={themeStyle({ width: '100%', height: 6, backgroundColor: '#11111E', borderRadius: 3 })}>
                    <View style={themeStyle({ height: '100%', backgroundColor: '#4F46E5', borderRadius: 3, width: `${details.average}%` })} />
                  </View>
                </View>
              ))}
            </View>

            {/* Progress Progression Timeline & Visual Chart */}
            <Text style={themeStyle({ fontWeight: '800', fontSize: 15, color: '#FFFFFF', marginBottom: 14 })}>
              Progression Curve
            </Text>
            <View style={themeStyle({ backgroundColor: '#1A1A2E', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#2D2D4E', marginBottom: 24 })}>
              {/* Visual Bar Chart */}
              <View style={themeStyle({ height: 120, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: '#2D2D4E', marginBottom: 20 })}>
                {stats.progression.map((item, idx) => {
                  const barHeight = Math.max(10, Math.min(100, item.score)); // normalize score between 10% and 100% height
                  return (
                    <View key={idx} style={themeStyle({ alignItems: 'center', flex: 1 })}>
                      <Text style={themeStyle({ fontWeight: '700', fontSize: 9, color: item.score >= 50 ? '#10B981' : '#EF4444', marginBottom: 4 })}>
                        {item.score}%
                      </Text>
                      <View style={themeStyle({
                        width: 14,
                        height: `${barHeight}%`,
                        backgroundColor: item.score >= 50 ? '#4F46E5' : '#EF4444',
                        borderRadius: 4,
                      })} />
                      <Text style={themeStyle({ fontWeight: '500', fontSize: 9, color: '#64748B', marginTop: 6 })}>
                        T{idx + 1}
                      </Text>
                    </View>
                  );
                })}
              </View>

              {/* Progression list details */}
              <View style={themeStyle({ gap: 14 })}>
                {stats.progression.map((item, idx) => (
                  <View key={idx} style={themeStyle({ flexDirection: 'row', alignItems: 'flex-start', gap: 12 })}>
                    <View style={themeStyle({ alignItems: 'center' })}>
                      <View style={themeStyle({ width: 8, height: 8, borderRadius: 4, backgroundColor: '#818CF8', marginTop: 6 })} />
                      {idx < stats.progression.length - 1 && (
                        <View style={themeStyle({ width: 2, height: 32, backgroundColor: '#2D2D4E', marginVertical: 4 })} />
                      )}
                    </View>
                    <View style={themeStyle({ flex: 1 })}>
                      <View style={themeStyle({ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' })}>
                        <Text style={themeStyle({ fontWeight: '700', fontSize: 13, color: '#FFFFFF', flex: 1, marginRight: 8 })} numberOfLines={1}>
                          T{idx + 1}. {item.test_title}
                        </Text>
                        <Text style={themeStyle({ fontWeight: '800', fontSize: 13, color: item.score >= 50 ? '#10B981' : '#EF4444' })}>{item.score}%</Text>
                      </View>
                      <Text style={themeStyle({ fontWeight: '400', fontSize: 10, color: '#4B5563', marginTop: 2 })}>{new Date(item.date).toLocaleDateString()}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* Attempts History */}
            <Text style={themeStyle({ fontWeight: '800', fontSize: 15, color: '#FFFFFF', marginBottom: 14 })}>
              Attempts Log
            </Text>
            <View style={themeStyle({ gap: 10 })}>
              {attempts.map((attempt) => (
                <TouchableOpacity
                  key={attempt.id}
                  onPress={() => router.push(`/test/result?testId=${attempt.test_id}&attemptId=${attempt.id}` as any)}
                  style={themeStyle({
                    backgroundColor: '#1A1A2E',
                    borderRadius: 16,
                    padding: 14,
                    borderWidth: 1,
                    borderColor: '#2D2D4E',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  })}
                >
                  <View style={themeStyle({ flex: 1, marginRight: 12 })}>
                    <Text style={themeStyle({ fontWeight: '700', fontSize: 13, color: '#FFFFFF' })} numberOfLines={1}>
                      {attempt.test_title || 'Mock Test'}
                    </Text>
                    <Text style={themeStyle({ fontWeight: '400', fontSize: 10, color: '#4B5563', marginTop: 4 })}>
                      Score: {attempt.correct_count ?? attempt.correct_answers ?? 0}/{attempt.total_questions} correct
                    </Text>
                  </View>
                  <View style={themeStyle({ flexDirection: 'row', alignItems: 'center', gap: 6 })}>
                    <Text style={themeStyle({ fontWeight: '800', fontSize: 13, color: attempt.score >= 50 ? '#10B981' : '#EF4444' })}>
                      {attempt.score}%
                    </Text>
                    <ChevronRight size={14} color="#64748B" />
                  </View>
                </TouchableOpacity>
              ))}
            </View>

          </Animated.View>
        </ScrollView>
      )}
    </View>
  );
}
