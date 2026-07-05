import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, CheckCircle2, AlertTriangle, BookOpen, RefreshCw, XCircle } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { api } from '@/utils/api';
import { themeStyle } from '@/utils/theme';

// W not used

interface AttemptDetails {
  id: string;
  test_id: string;
  score: number;
  correct_answers: number;
  total_questions: number;
  answers: { questionId: string; selectedOptionIndex: number }[];
}

interface Question {
  id: string;
  question_text: string;
  options: string[];
  correct_index: number;
  explanation: string;
}

export default function TestResultScreen() {
  const { testId, attemptId } = useLocalSearchParams<{ testId: string; attemptId: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Fetch attempts to locate the current one
  const { data: attempts = [], isLoading: attemptsLoading } = useQuery<any[]>({
    queryKey: ['my-attempts', testId],
    enabled: Boolean(testId),
    queryFn: () => api(`/api/courses/tests/attempts?course_id=all`),
  });

  // Fetch full review questions (including correct_index and explanation)
  const { data: questions = [], isLoading: questionsLoading } = useQuery<Question[]>({
    queryKey: ['review-questions', testId],
    enabled: Boolean(testId),
    queryFn: () => api(`/api/courses/tests/questions?test_id=${testId}&review=true`),
  });

  const attempt: AttemptDetails | undefined = attempts.find(
    (a: any) => String(a.id) === String(attemptId)
  );

  useEffect(() => {
    if (!attemptsLoading && attempt) {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 450, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, tension: 70, friction: 10, useNativeDriver: true }),
      ]).start();
    }
  }, [attemptsLoading, attempt]);

  if (attemptsLoading || questionsLoading) {
    return (
      <View style={themeStyle({ flex: 1, backgroundColor: '#0A0A0F', justifyContent: 'center', alignItems: 'center' })}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={themeStyle({ fontWeight: '600', fontSize: 13, color: '#64748B', marginTop: 12 })}>
          Loading test results...
        </Text>
      </View>
    );
  }

  if (!attempt) {
    return (
      <View style={themeStyle({ flex: 1, backgroundColor: '#0A0A0F', justifyContent: 'center', alignItems: 'center', padding: 20 })}>
        <Text style={themeStyle({ fontWeight: '700', fontSize: 16, color: '#EF4444', textAlign: 'center', marginBottom: 16 })}>
          Test attempt details not found.
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={themeStyle({ backgroundColor: '#4F46E5', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12 })}
        >
          <Text style={themeStyle({ fontWeight: '700', fontSize: 13, color: '#FFFFFF' })}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const wrongAnswers = attempt.total_questions - attempt.correct_answers;
  const passed = attempt.score >= 50;

  return (
    <View style={themeStyle({ flex: 1, backgroundColor: '#0A0A0F', paddingTop: insets.top })}>
      <StatusBar style="light" />

      {/* Header bar */}
      <View style={themeStyle({ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#1E1B4B' })}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={themeStyle({ flexDirection: 'row', alignItems: 'center', gap: 6 })}
        >
          <ArrowLeft size={16} color="#A5B4FC" />
          <Text style={themeStyle({ fontWeight: '700', fontSize: 13, color: '#A5B4FC' })}>Back to course</Text>
        </TouchableOpacity>
        <Text style={themeStyle({ fontWeight: '700', fontSize: 14, color: '#FFFFFF' })}>
          Review Report
        </Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 60 }}
      >
        <Animated.View style={themeStyle({ opacity: fadeAnim, transform: [{ scale: scaleAnim }] })}>
          {/* Summary Score Card */}
          <View
            style={themeStyle({
              backgroundColor: '#1A1A2E',
              borderRadius: 24,
              padding: 24,
              borderWidth: 1,
              borderColor: '#2D2D4E',
              alignItems: 'center',
              marginBottom: 24,
            })}
          >
            <View
              style={themeStyle({
                width: 100,
                height: 100,
                borderRadius: 50,
                backgroundColor: passed ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 2,
                borderColor: passed ? '#10B981' : '#EF4444',
                marginBottom: 16,
              })}
            >
              <Text
                style={themeStyle({
                  fontWeight: '800',
                  fontSize: 26,
                  color: passed ? '#10B981' : '#EF4444',
                })}
              >
                {attempt.score}%
              </Text>
            </View>

            <Text style={themeStyle({ fontWeight: '800', fontSize: 20, color: '#FFFFFF', marginBottom: 4 })}>
              {passed ? 'Congratulations!' : 'Keep Learning!'}
            </Text>
            <Text style={themeStyle({ fontWeight: '400', fontSize: 13, color: '#64748B', textAlign: 'center', marginBottom: 20 })}>
              {passed ? "You've successfully cleared this diagnostic module." : 'Review the explanations below to improve your understanding.'}
            </Text>

            {/* Micro stats indicators */}
            <View style={themeStyle({ flexDirection: 'row', gap: 16, width: '100%' })}>
              <View style={themeStyle({ flex: 1, backgroundColor: '#11111E', borderRadius: 16, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: '#2D2D4E' })}>
                <CheckCircle2 size={16} color="#10B981" style={{ marginBottom: 4 }} />
                <Text style={themeStyle({ fontWeight: '800', fontSize: 15, color: '#FFFFFF' })}>{attempt.correct_answers}</Text>
                <Text style={themeStyle({ fontWeight: '500', fontSize: 10, color: '#4B5563', textTransform: 'uppercase', marginTop: 2 })}>Correct</Text>
              </View>

              <View style={themeStyle({ flex: 1, backgroundColor: '#11111E', borderRadius: 16, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: '#2D2D4E' })}>
                <XCircle size={16} color="#EF4444" style={{ marginBottom: 4 }} />
                <Text style={themeStyle({ fontWeight: '800', fontSize: 15, color: '#FFFFFF' })}>{wrongAnswers}</Text>
                <Text style={themeStyle({ fontWeight: '500', fontSize: 10, color: '#4B5563', textTransform: 'uppercase', marginTop: 2 })}>Incorrect</Text>
              </View>

              <View style={themeStyle({ flex: 1, backgroundColor: '#11111E', borderRadius: 16, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: '#2D2D4E' })}>
                <BookOpen size={16} color="#818CF8" style={{ marginBottom: 4 }} />
                <Text style={themeStyle({ fontWeight: '800', fontSize: 15, color: '#FFFFFF' })}>{attempt.total_questions}</Text>
                <Text style={themeStyle({ fontWeight: '500', fontSize: 10, color: '#4B5563', textTransform: 'uppercase', marginTop: 2 })}>Total Qs</Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => router.replace(`/test/${testId}` as any)}
              style={themeStyle({
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                backgroundColor: 'rgba(79,70,229,0.15)',
                borderColor: '#4F46E5',
                borderWidth: 1,
                borderRadius: 14,
                width: '100%',
                justifyContent: 'center',
                paddingVertical: 12,
                marginTop: 20,
              })}
            >
              <RefreshCw size={14} color="#818CF8" />
              <Text style={themeStyle({ fontWeight: '700', fontSize: 13, color: '#818CF8' })}>Retake Mock Test</Text>
            </TouchableOpacity>
          </View>

          {/* Itemized Questions review */}
          <Text style={themeStyle({ fontWeight: '800', fontSize: 16, color: '#FFFFFF', marginBottom: 16 })}>
            Explanations & Key Reviews
          </Text>

          <View style={themeStyle({ gap: 16 })}>
            {questions.map((q, idx) => {
              const studentAnswer = attempt.answers.find((a) => String(a.questionId) === String(q.id));
              const selectedIdx = studentAnswer ? studentAnswer.selectedOptionIndex : -1;
              const isCorrect = selectedIdx === q.correct_index;

              return (
                <View
                  key={q.id}
                  style={themeStyle({
                    backgroundColor: '#1A1A2E',
                    borderRadius: 20,
                    padding: 16,
                    borderWidth: 1,
                    borderColor: '#2D2D4E',
                  })}
                >
                  {/* Status Indicator */}
                  <View style={themeStyle({ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 })}>
                    <Text style={themeStyle({ fontWeight: '700', fontSize: 11, color: '#818CF8' })}>
                      QUESTION {idx + 1}
                    </Text>
                    <View style={themeStyle({
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 4,
                      backgroundColor: isCorrect ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 8,
                    })}>
                      {isCorrect ? (
                        <>
                          <CheckCircle2 size={12} color="#10B981" />
                          <Text style={themeStyle({ fontWeight: '700', fontSize: 10, color: '#10B981' })}>Correct</Text>
                        </>
                      ) : (
                        <>
                          <AlertTriangle size={12} color="#EF4444" />
                          <Text style={themeStyle({ fontWeight: '700', fontSize: 10, color: '#EF4444' })}>
                            {selectedIdx === -1 ? 'Skipped' : 'Incorrect'}
                          </Text>
                        </>
                      )}
                    </View>
                  </View>

                  <Text style={themeStyle({ fontWeight: '700', fontSize: 14, color: '#FFFFFF', lineHeight: 20, marginBottom: 14 })}>
                    {q.question_text}
                  </Text>

                  {/* Options items */}
                  <View style={themeStyle({ gap: 8, marginBottom: 14 })}>
                    {q.options.map((opt, oIdx) => {
                      const isCorrectOpt = oIdx === q.correct_index;
                      const isSelectedOpt = oIdx === selectedIdx;

                      let optBg = '#11111E';
                      let optBorder = '#2D2D4E';
                      let optText = '#CBD5E1';
                      let badgeBg = '#1A1A2E';
                      let badgeText = '#64748B';

                      if (isCorrectOpt) {
                        optBg = 'rgba(16,185,129,0.1)';
                        optBorder = '#10B981';
                        optText = '#10B981';
                        badgeBg = '#10B981';
                        badgeText = '#FFFFFF';
                      } else if (isSelectedOpt && !isCorrectOpt) {
                        optBg = 'rgba(239,68,68,0.1)';
                        optBorder = '#EF4444';
                        optText = '#EF4444';
                        badgeBg = '#EF4444';
                        badgeText = '#FFFFFF';
                      }

                      return (
                        <View
                          key={oIdx}
                          style={themeStyle({
                            flexDirection: 'row',
                            alignItems: 'center',
                            padding: 12,
                            borderRadius: 12,
                            backgroundColor: optBg,
                            borderWidth: 1,
                            borderColor: optBorder,
                            gap: 12,
                          })}
                        >
                          <View style={themeStyle({
                            width: 24,
                            height: 24,
                            borderRadius: 6,
                            backgroundColor: badgeBg,
                            alignItems: 'center',
                            justifyContent: 'center',
                          })}>
                            <Text style={themeStyle({ fontWeight: '700', fontSize: 11, color: badgeText })}>
                              {String.fromCharCode(65 + oIdx)}
                            </Text>
                          </View>
                          <Text style={themeStyle({ fontWeight: '500', fontSize: 13, color: optText, flex: 1 })}>
                            {opt}
                          </Text>
                        </View>
                      );
                    })}
                  </View>

                  {/* Explanation card */}
                  {q.explanation && (
                    <View
                      style={themeStyle({
                        backgroundColor: '#11111E',
                        borderRadius: 12,
                        padding: 12,
                        borderWidth: 1,
                        borderColor: '#2D2D4E',
                      })}
                    >
                      <Text style={themeStyle({ fontWeight: '700', fontSize: 11, color: '#A5B4FC', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 })}>
                        Explanation:
                      </Text>
                      <Text style={themeStyle({ fontWeight: '400', fontSize: 12, color: '#94A3B8', lineHeight: 16 })}>
                        {q.explanation}
                      </Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
