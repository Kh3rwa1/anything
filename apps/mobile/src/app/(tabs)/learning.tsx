import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Alert,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  PlayCircle,
  Clock,
  Trophy,
  Award,
  ChevronRight,
  BookOpen,
  Zap,
  Target,
  Lock,
} from 'lucide-react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useQuery } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useAppTheme, themeStyle } from '@/utils/theme';
import { api } from '@/utils/api';
import type { Enrollment } from '@/types';





function StatMini({
  val,
  label,
  icon,
  delay,
}: {
  val: string;
  label: string;
  icon: React.ReactNode;
  delay: number;
}) {
  const a = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(a, {
      toValue: 1,
      tension: 80,
      friction: 8,
      delay,
      useNativeDriver: true,
    }).start();
  }, []);
  return (
    <Animated.View
      style={themeStyle({
        flex: 1,
        backgroundColor: '#111118',
        borderRadius: 14,
        padding: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#2D2D4E',
        opacity: a,
        transform: [{ scale: a }],
      })}
    >
      {icon}
      <Text style={themeStyle({ fontWeight: '800', fontSize: 16, color: '#F1F5F9', marginTop: 4 })}>
        {val}
      </Text>
      <Text style={themeStyle({ fontWeight: '400', fontSize: 9, color: '#4B5563', marginTop: 1 })}>
        {label}
      </Text>
    </Animated.View>
  );
}

function EnrollCard({
  item,
  index,
  onContinue,
}: {
  item: Enrollment;
  index: number;
  onContinue: () => void;
}) {
  const anim = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(40)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(anim, {
        toValue: 1,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.spring(slide, {
        toValue: 0,
        tension: 80,
        friction: 10,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  return (
    <Animated.View
      style={themeStyle({
        opacity: anim,
        transform: [{ translateY: slide }],
        backgroundColor: '#1A1A2E',
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 14,
        borderWidth: 1,
        borderColor: '#2D2D4E',
      })}
    >
      <View style={themeStyle({ height: 4, backgroundColor: '#4F46E5' })} />
      <View style={themeStyle({ flexDirection: 'row', padding: 14, gap: 12 })}>
        <View
          style={themeStyle({
            borderRadius: 12,
            overflow: 'hidden',
            width: 80,
            height: 80,
            flexShrink: 0,
          })}
        >
          <Image
            source={{
              uri:
                item.thumbnail_url ||
                'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400',
            }}
            style={themeStyle({ width: 80, height: 80 })}
            contentFit="cover"
          />
        </View>
        <View style={themeStyle({ flex: 1 })}>
          <Text
            style={themeStyle({
              fontWeight: '700',
              fontSize: 14,
              color: '#F1F5F9',
              lineHeight: 19,
              marginBottom: 4,
            })}
            numberOfLines={2}
          >
            {item.title}
          </Text>
          <Text
            style={themeStyle({
              fontWeight: '400',
              fontSize: 11,
              color: '#4B5563',
              marginBottom: 10,
            })}
          >
            by {item.instructor}
          </Text>
          <View
            style={themeStyle({
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            })}
          >
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                onContinue();
              }}
              style={themeStyle({
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
                backgroundColor: '#4F46E5',
                borderRadius: 99,
                paddingHorizontal: 14,
                paddingVertical: 7,
              })}
            >
              <PlayCircle size={13} color="#FFFFFF" />
              <Text style={themeStyle({ fontWeight: '700', fontSize: 12, color: '#FFFFFF' })}>
                Continue
              </Text>
            </TouchableOpacity>
            <Text style={themeStyle({ fontWeight: '600', fontSize: 11, color: '#10B981' })}>
              Active
            </Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}



export default function LearningScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const headerFade = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(-30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerFade, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(headerSlide, {
        toValue: 0,
        tension: 80,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const theme = useAppTheme();
  const { data: enrollments = [], isLoading, isError, refetch } = useQuery<Enrollment[]>({
    queryKey: ['my-enrollments'],
    retry: 2,
    queryFn: () => api('/api/enroll'),
  });

  return (
    <View style={themeStyle({ flex: 1, backgroundColor: '#0A0A0F' })}>
      <StatusBar style={theme.statusBar} />
      <Animated.View
        style={themeStyle({ opacity: headerFade, transform: [{ translateY: headerSlide }] })}
      >
        <LinearGradient
          colors={['#1E1B4B', '#0A0A0F']}
          style={themeStyle({
            paddingTop: insets.top + 12,
            paddingHorizontal: 20,
            paddingBottom: 24,
          })}
        >
          <Text
            style={themeStyle({
              fontWeight: '800',
              fontSize: 28,
              color: '#FFFFFF',
              letterSpacing: -0.5,
              marginBottom: 4,
            })}
          >
            My Learning
          </Text>
          <Text style={themeStyle({ fontWeight: '400', fontSize: 13, color: '#6366F1' })}>
            {enrollments.length === 0 ? 'Start your learning journey today! 🚀' : 'Keep pushing — greatness is close 💪'}
          </Text>
          <View style={themeStyle({ flexDirection: 'row', gap: 10, marginTop: 20 })}>
            <StatMini
              val={String(enrollments.length)}
              label="Enrolled Courses"
              icon={<BookOpen size={14} color="#818CF8" />}
              delay={200}
            />

            <StatMini
              val="0"
              label="Certificates"
              icon={<Award size={14} color="#10B981" />}
              delay={280}
            />
          </View>
        </LinearGradient>
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => refetch()}
            tintColor="#818CF8"
            colors={['#818CF8']}
          />
        }
      >
        {/* Continue Learning */}
        <View style={themeStyle({ paddingHorizontal: 20, marginBottom: 24, marginTop: 16 })}>
          <View
            style={themeStyle({
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 14,
            })}
          >
            <Text style={themeStyle({ fontWeight: '700', fontSize: 18, color: '#F1F5F9' })}>
              Continue Learning
            </Text>
            <TouchableOpacity
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              style={themeStyle({ flexDirection: 'row', alignItems: 'center', gap: 4 })}
            >
              <Text style={themeStyle({ fontWeight: '600', fontSize: 13, color: '#818CF8' })}>
                All
              </Text>
              <ChevronRight size={14} color="#818CF8" />
            </TouchableOpacity>
          </View>
          {isLoading ? (
            <ActivityIndicator color="#4F46E5" style={themeStyle({ marginVertical: 40 })} />
          ) : !enrollments || enrollments.length === 0 ? (
            <View
              style={themeStyle({
                alignItems: 'center',
                paddingVertical: 48,
                backgroundColor: '#1A1A2E',
                borderRadius: 20,
                borderWidth: 1,
                borderColor: '#2D2D4E',
              })}
            >
              <Text style={themeStyle({ fontSize: 48, marginBottom: 12 })}>📚</Text>
              <Text
                style={themeStyle({
                  fontWeight: '700',
                  fontSize: 16,
                  color: '#F1F5F9',
                  marginBottom: 6,
                })}
              >
                No courses yet
              </Text>
              <Text
                style={themeStyle({
                  fontWeight: '400',
                  fontSize: 13,
                  color: '#4B5563',
                  textAlign: 'center',
                  paddingHorizontal: 32,
                })}
              >
                Start learning by enrolling in your first course!
              </Text>
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push('/' as any);
                }}
                style={themeStyle({
                  marginTop: 16,
                  backgroundColor: '#4F46E5',
                  borderRadius: 99,
                  paddingHorizontal: 22,
                  paddingVertical: 11,
                })}
              >
                <Text style={themeStyle({ fontWeight: '700', fontSize: 13, color: '#FFFFFF' })}>
                  Explore Courses
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            enrollments.map((item: Enrollment, index: number) => (
              <EnrollCard
                key={item.id}
                item={item}
                index={index}
                onContinue={() => router.push(`/course/${item.course_id}` as any)}
              />
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}
