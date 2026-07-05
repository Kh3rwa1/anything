import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Animated,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ArrowLeft, Clock, CheckCircle, ChevronRight, ChevronLeft, Info } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { api } from '@/utils/api';
import { themeStyle } from '@/utils/theme';
import { scheduleLocalMockTestReminder } from '@/app/notifications';

// W not used

interface Question {
  id: string;
  question_text: string;
  options: string[];
}

export default function TestSessionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [testStarted, setTestStarted] = useState(false);

  // Animation values
  const pageFade = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  // Fetch test details
  const { data: test, isLoading: testLoading } = useQuery<any>({
    queryKey: ['test-session-details', id],
    enabled: Boolean(id),
    queryFn: async () => {
      const list = await api('/api/courses/tests?course_id=all');
      return list.find((t: any) => String(t.id) === String(id));
    },
  });

  // Fetch questions (without answers for security)
  const { data: questions = [], isLoading: questionsLoading } = useQuery<Question[]>({
    queryKey: ['test-session-questions', id],
    enabled: Boolean(id) && testStarted,
    queryFn: () => api(`/api/courses/tests/questions?test_id=${id}`),
  });

  // Submit test response
  const submitMutation = useMutation({
    mutationFn: async () => {
      const formattedAnswers = questions.map((q) => ({
        questionId: q.id,
        selectedOptionIndex: answers[q.id] !== undefined ? answers[q.id] : -1,
      }));
      return api('/api/courses/tests/submit', {
        method: 'POST',
        body: JSON.stringify({
          testId: id,
          answers: formattedAnswers,
        }),
      });
    },
    onSuccess: (result) => {
      // Trigger a local push notification reminder to maintain streak
      scheduleLocalMockTestReminder();
      // Redirect to result screen
      router.replace(`/test/result?testId=${id}&attemptId=${result.attemptId}` as any);
    },
    onError: () => {
      Alert.alert('Error', 'Failed to submit test. Please check your internet connection and try again.');
    },
  });

  // Setup timer count down
  useEffect(() => {
    if (!testStarted || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitTest(true); // Auto-submit when time runs out!
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [testStarted, timeLeft]);

  // Entrance animations
  useEffect(() => {
    Animated.parallel([
      Animated.timing(pageFade, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 100, friction: 10, useNativeDriver: true }),
    ]).start();
  }, [testStarted]);

  const handleStartTest = () => {
    if (!test) return;
    setTimeLeft(test.duration_minutes * 60);
    setTestStarted(true);
  };

  const handleSelectOption = (qId: string, optIdx: number) => {
    setAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const handleSubmitTest = (force = false) => {
    if (force) {
      submitMutation.mutate();
      return;
    }
    const unansweredCount = questions.length - Object.keys(answers).length;
    const message = unansweredCount > 0 
      ? `You have ${unansweredCount} unanswered questions left. Do you still want to submit?`
      : 'Are you sure you want to finish and submit your responses?';

    Alert.alert('Submit Mock Test', message, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Submit', style: 'destructive', onPress: () => submitMutation.mutate() },
    ]);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${rs.toString().padStart(2, '0')}`;
  };

  if (testLoading || submitMutation.isPending) {
    return (
      <View style={themeStyle({ flex: 1, backgroundColor: '#0A0A0F', justifyContent: 'center', alignItems: 'center' })}>
        <StatusBar style="light" />
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={themeStyle({ fontWeight: '600', fontSize: 14, color: '#94A3B8', marginTop: 16 })}>
          {submitMutation.isPending ? 'Calculating test results...' : 'Loading test details...'}
        </Text>
      </View>
    );
  }

  if (!testStarted) {
    return (
      <View style={themeStyle({ flex: 1, backgroundColor: '#0A0A0F', paddingTop: insets.top + 16, paddingHorizontal: 20 })}>
        <StatusBar style="light" />
        <TouchableOpacity
          onPress={() => router.back()}
          style={themeStyle({
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: '#1E1B4B',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 24,
          })}
        >
          <ArrowLeft size={20} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={themeStyle({ flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 40 })}>
          <View style={themeStyle({ width: 72, height: 72, borderRadius: 36, backgroundColor: 'rgba(79,70,229,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 20 })}>
            <Clock size={36} color="#818CF8" />
          </View>

          <Text style={themeStyle({ fontWeight: '800', fontSize: 24, color: '#FFFFFF', textAlign: 'center', marginBottom: 8 })}>
            {test.title}
          </Text>
          <Text style={themeStyle({ fontWeight: '400', fontSize: 14, color: '#64748B', textAlign: 'center', marginBottom: 30 })}>
            Prepare yourself. This diagnostic quiz tests your retention and domain knowledge.
          </Text>

          <View style={themeStyle({ width: '100%', backgroundColor: '#1A1A2E', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#2D2D4E', marginBottom: 40, gap: 14 })}>
            <View style={themeStyle({ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' })}>
              <Text style={themeStyle({ fontWeight: '500', fontSize: 14, color: '#94A3B8' })}>Total Questions</Text>
              <Text style={themeStyle({ fontWeight: '700', fontSize: 14, color: '#FFFFFF' })}>{test.question_count} Qs</Text>
            </View>
            <View style={themeStyle({ width: '100%', height: 1, backgroundColor: '#2D2D4E' })} />
            <View style={themeStyle({ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' })}>
              <Text style={themeStyle({ fontWeight: '500', fontSize: 14, color: '#94A3B8' })}>Time Limit</Text>
              <Text style={themeStyle({ fontWeight: '700', fontSize: 14, color: '#FFFFFF' })}>{test.duration_minutes} Minutes</Text>
            </View>
            <View style={themeStyle({ width: '100%', height: 1, backgroundColor: '#2D2D4E' })} />
            <View style={themeStyle({ flexDirection: 'row', gap: 10, alignItems: 'flex-start', marginTop: 4 })}>
              <Info size={16} color="#818CF8" style={{ marginTop: 2 }} />
              <Text style={themeStyle({ fontWeight: '400', fontSize: 12, color: '#64748B', flex: 1, lineHeight: 16 })}>
                Once started, the timer cannot be paused. The test will automatically submit when the countdown reaches zero.
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleStartTest}
            style={themeStyle({
              width: '100%',
              backgroundColor: '#4F46E5',
              borderRadius: 16,
              paddingVertical: 16,
              alignItems: 'center',
              justifyContent: 'center',
            })}
          >
            <Text style={themeStyle({ fontWeight: '700', fontSize: 16, color: '#FFFFFF' })}>
              Start Session
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (questionsLoading || questions.length === 0) {
    return (
      <View style={themeStyle({ flex: 1, backgroundColor: '#0A0A0F', justifyContent: 'center', alignItems: 'center' })}>
        <StatusBar style="light" />
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={themeStyle({ fontWeight: '600', fontSize: 14, color: '#94A3B8', marginTop: 16 })}>
          Retrieving test questions...
        </Text>
      </View>
    );
  }

  const currentQuestion = questions[currentIdx];
  const selectedOption = answers[currentQuestion.id];
  const progressPercent = Math.round((Object.keys(answers).length / questions.length) * 100);

  return (
    <View style={themeStyle({ flex: 1, backgroundColor: '#0A0A0F', paddingTop: insets.top })}>
      <StatusBar style="light" />

      {/* Header section */}
      <View style={themeStyle({ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#1E1B4B' })}>
        <TouchableOpacity
          onPress={() => {
            Alert.alert('Exit Quiz?', 'All current test progress will be lost. Exit anyway?', [
              { text: 'Stay', style: 'cancel' },
              { text: 'Exit', style: 'destructive', onPress: () => router.back() },
            ]);
          }}
          style={themeStyle({ width: 36, height: 36, borderRadius: 18, backgroundColor: '#1A1A2E', alignItems: 'center', justifyContent: 'center' })}
        >
          <ArrowLeft size={16} color="#A5B4FC" />
        </TouchableOpacity>

        <View style={themeStyle({ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: timeLeft < 60 ? 'rgba(239,68,68,0.15)' : '#1E1B4B', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 99 })}>
          <Clock size={14} color={timeLeft < 60 ? '#EF4444' : '#818CF8'} />
          <Text style={themeStyle({ fontWeight: '700', fontSize: 13, color: timeLeft < 60 ? '#EF4444' : '#FFFFFF', width: 44, textAlign: 'center' })}>
            {formatTime(timeLeft)}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => handleSubmitTest(false)}
          style={themeStyle({ backgroundColor: '#10B981', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 })}
        >
          <Text style={themeStyle({ fontWeight: '700', fontSize: 12, color: '#FFFFFF' })}>
            Submit
          </Text>
        </TouchableOpacity>
      </View>

      {/* Progress slider bar */}
      <View style={themeStyle({ width: '100%', height: 4, backgroundColor: '#1E1B4B' })}>
        <View style={themeStyle({ height: '100%', backgroundColor: '#4F46E5', width: `${progressPercent}%` })} />
      </View>

      {/* Scrollable Questions Canvas */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 120 }}
      >
        <Animated.View style={themeStyle({ opacity: pageFade, transform: [{ translateY: slideAnim }] })}>
          <View style={themeStyle({ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 })}>
            <Text style={themeStyle({ fontWeight: '700', fontSize: 13, color: '#818CF8' })}>
              QUESTION {currentIdx + 1} OF {questions.length}
            </Text>
            <Text style={themeStyle({ fontWeight: '500', fontSize: 12, color: '#64748B' })}>
              {Object.keys(answers).length} of {questions.length} answered
            </Text>
          </View>

          <Text style={themeStyle({ fontWeight: '700', fontSize: 17, color: '#FFFFFF', lineHeight: 24, marginBottom: 24 })}>
            {currentQuestion.question_text}
          </Text>

          <View style={themeStyle({ gap: 12, marginBottom: 30 })}>
            {currentQuestion.options.map((opt, oIdx) => {
              const isSelected = selectedOption === oIdx;
              return (
                <TouchableOpacity
                  key={oIdx}
                  onPress={() => handleSelectOption(currentQuestion.id, oIdx)}
                  style={themeStyle({
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 16,
                    borderRadius: 16,
                    backgroundColor: isSelected ? 'rgba(79,70,229,0.12)' : '#1A1A2E',
                    borderWidth: 1,
                    borderColor: isSelected ? '#4F46E5' : '#2D2D4E',
                  })}
                >
                  <View style={themeStyle({
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: isSelected ? '#818CF8' : '#4B5563',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                    backgroundColor: isSelected ? '#4F46E5' : '#11111E',
                  })}>
                    <Text style={themeStyle({
                      fontWeight: '800',
                      fontSize: 12,
                      color: isSelected ? '#FFFFFF' : '#64748B',
                    })}>
                      {String.fromCharCode(65 + oIdx)}
                    </Text>
                  </View>
                  <Text style={themeStyle({ fontWeight: '500', fontSize: 14, color: isSelected ? '#FFFFFF' : '#CBD5E1', flex: 1 })}>
                    {opt}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Quick-Jump Question Navigation Matrix */}
          <Text style={themeStyle({ fontWeight: '700', fontSize: 13, color: '#64748B', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 })}>
            Question Matrix
          </Text>
          <View style={themeStyle({ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 40 })}>
            {questions.map((q, idx) => {
              const isCurrent = idx === currentIdx;
              const isAnswered = answers[q.id] !== undefined;
              
              let bg = '#1A1A2E';
              let border = '#2D2D4E';
              let textC = '#94A3B8';

              if (isCurrent) {
                bg = 'rgba(79,70,229,0.15)';
                border = '#818CF8';
                textC = '#818CF8';
              } else if (isAnswered) {
                bg = '#4F46E5';
                border = '#4F46E5';
                textC = '#FFFFFF';
              }

              return (
                <TouchableOpacity
                  key={q.id}
                  onPress={() => setCurrentIdx(idx)}
                  style={themeStyle({
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: border,
                    backgroundColor: bg,
                    alignItems: 'center',
                    justifyContent: 'center',
                  })}
                >
                  <Text style={themeStyle({ fontWeight: '700', fontSize: 12, color: textC })}>
                    {idx + 1}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>
      </ScrollView>

      {/* Footer Navigation Bar */}
      <View style={themeStyle({
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 80,
        backgroundColor: '#0F0F1A',
        borderTopWidth: 1,
        borderTopColor: '#1E1B4B',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: insets.bottom > 0 ? insets.bottom / 2 : 0,
      })}>
        <TouchableOpacity
          onPress={() => setCurrentIdx((p) => Math.max(0, p - 1))}
          disabled={currentIdx === 0}
          style={themeStyle({
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            paddingVertical: 10,
            paddingHorizontal: 16,
            borderRadius: 12,
            backgroundColor: currentIdx === 0 ? 'transparent' : '#1A1A2E',
            opacity: currentIdx === 0 ? 0.3 : 1,
          })}
        >
          <ChevronLeft size={16} color="#FFFFFF" />
          <Text style={themeStyle({ fontWeight: '700', fontSize: 13, color: '#FFFFFF' })}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            if (currentIdx === questions.length - 1) {
              handleSubmitTest(false);
            } else {
              setCurrentIdx((p) => Math.min(questions.length - 1, p + 1));
            }
          }}
          style={themeStyle({
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 12,
            backgroundColor: currentIdx === questions.length - 1 ? '#10B981' : '#4F46E5',
          })}
        >
          <Text style={themeStyle({ fontWeight: '700', fontSize: 13, color: '#FFFFFF' })}>
            {currentIdx === questions.length - 1 ? 'Finish' : 'Next'}
          </Text>
          {currentIdx < questions.length - 1 && <ChevronRight size={16} color="#FFFFFF" />}
        </TouchableOpacity>
      </View>
    </View>
  );
}
