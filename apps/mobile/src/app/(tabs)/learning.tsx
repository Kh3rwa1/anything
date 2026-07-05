/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
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
import { themeStyle } from '@/utils/theme';

const BADGES = [
  { icon: '🏆', label: 'Topper', earned: true },
  { icon: '⚡', label: 'Fast Learner', earned: true },
  { icon: '🎯', label: 'Goal Setter', earned: true },
  { icon: '🔥', label: '30-Day', earned: false },
  { icon: '💎', label: 'Diamond', earned: false },
];

const ROADMAP = [
  { step: 1, label: 'DSA Basics', done: true },
  { step: 2, label: 'Advanced DSA', done: true },
  { step: 3, label: 'System Design', done: false },
  { step: 4, label: 'Mock Interviews', done: false },
];

function AnimatedBar({ pct, colors }: { pct: number; colors: [string, string] }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, {
      toValue: pct,
      duration: 1200,
      delay: 400,
      useNativeDriver: false,
    }).start();
  }, []);
  const width = anim.interpolate({ inputRange: [0, 100], outputRange: ['0%', `${pct}%`] });
  return (
    <View
      style={themeStyle({
        height: 8,
        backgroundColor: '#2D2D4E',
        borderRadius: 4,
        overflow: 'hidden',
      })}
    >
      <Animated.View
        style={themeStyle({ width, height: '100%', borderRadius: 4, overflow: 'hidden' })}
      >
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={themeStyle({ flex: 1 })}
        />
      </Animated.View>
    </View>
  );
}

function BadgeItem({
  badge,
  index,
}: {
  badge: { icon: string; label: string; earned: boolean };
  index: number;
}) {
  const anim = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.spring(anim, {
      toValue: 1,
      tension: 80,
      friction: 8,
      delay: 300 + index * 80,
      useNativeDriver: true,
    }).start();
    if (badge.earned) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, { toValue: 1.07, duration: 900, useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 1, duration: 900, useNativeDriver: true }),
        ])
      ).start();
    }
  }, []);
  return (
    <Animated.View style={themeStyle({ opacity: anim, transform: [{ scale: anim }] })}>
      <Animated.View
        style={themeStyle({
          width: 80,
          alignItems: 'center',
          backgroundColor: badge.earned ? '#1A1A2E' : '#111118',
          borderRadius: 16,
          paddingVertical: 14,
          paddingHorizontal: 8,
          borderWidth: 1,
          borderColor: badge.earned ? '#4F46E5' : '#2D2D4E',
          opacity: badge.earned ? 1 : 0.35,
          marginRight: 10,
          transform: badge.earned ? [{ scale: pulse }] : [],
        })}
      >
        <Text style={themeStyle({ fontSize: 28, marginBottom: 6 })}>{badge.icon}</Text>
        <Text
          style={themeStyle({
            fontWeight: '600',
            fontSize: 10,
            color: badge.earned ? '#818CF8' : '#4B5563',
            textAlign: 'center',
          })}
        >
          {badge.label}
        </Text>
      </Animated.View>
    </Animated.View>
  );
}

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
  item: any;
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
      <View style={themeStyle({ height: 4, backgroundColor: '#2D2D4E' })}>
        <View style={themeStyle({ height: '100%', width: '5%', backgroundColor: '#4F46E5' })} />
      </View>
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
              onPress={onContinue}
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
            <Text style={themeStyle({ fontWeight: '600', fontSize: 11, color: '#4B5563' })}>
              5% done
            </Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

function RoadmapStep({
  item,
  index,
}: {
  item: { step: number; label: string; done: boolean };
  index: number;
}) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(anim, {
      toValue: 1,
      tension: 80,
      friction: 8,
      delay: 300 + index * 100,
      useNativeDriver: true,
    }).start();
  }, []);
  return (
    <Animated.View
      style={themeStyle({
        opacity: anim,
        transform: [
          { translateX: anim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) },
        ],

        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        paddingVertical: 12,
        borderBottomWidth: index < ROADMAP.length - 1 ? 1 : 0,
        borderBottomColor: '#111118',
      })}
    >
      <View
        style={themeStyle({
          width: 36,
          height: 36,
          borderRadius: 18,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: item.done ? '#4F46E5' : '#2D2D4E',
        })}
      >
        {item.done ? <Zap size={16} color="#FFFFFF" /> : <Lock size={14} color="#4B5563" />}
      </View>
      <View style={themeStyle({ flex: 1 })}>
        <Text
          style={themeStyle({
            fontWeight: '600',
            fontSize: 13,
            color: item.done ? '#F1F5F9' : '#4B5563',
          })}
        >
          Step {item.step}: {item.label}
        </Text>
      </View>
      <View
        style={themeStyle({
          backgroundColor: item.done ? '#1E1B4B' : '#2D2D4E',
          borderRadius: 6,
          paddingHorizontal: 8,
          paddingVertical: 3,
        })}
      >
        <Text
          style={themeStyle({
            fontWeight: '700',
            fontSize: 10,
            color: item.done ? '#818CF8' : '#4B5563',
          })}
        >
          {item.done ? 'DONE' : 'LOCKED'}
        </Text>
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

  const { data: enrollments, isLoading } = useQuery({
    queryKey: ['my-enrollments'],
    queryFn: async () => {
      const res = await fetch('/api/enroll');
      if (!res.ok) throw new Error('failed');
      return res.json();
    },
  });

  return (
    <View style={themeStyle({ flex: 1, backgroundColor: '#0A0A0F' })}>
      <StatusBar style="light" />
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
            Keep pushing — greatness is close 💪
          </Text>
          <View
            style={themeStyle({
              marginTop: 20,
              backgroundColor: '#1A1A2E',
              borderRadius: 16,
              padding: 16,
              borderWidth: 1,
              borderColor: '#2D2D4E',
            })}
          >
            <View
              style={themeStyle({
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 10,
              })}
            >
              <View style={themeStyle({ flexDirection: 'row', alignItems: 'center', gap: 6 })}>
                <Text style={themeStyle({ fontSize: 18 })}>⚡</Text>
                <Text style={themeStyle({ fontWeight: '700', fontSize: 14, color: '#F1F5F9' })}>
                  Level 7 — Elite Prepster
                </Text>
              </View>
              <Text style={themeStyle({ fontWeight: '700', fontSize: 13, color: '#818CF8' })}>
                480 / 600 XP
              </Text>
            </View>
            <AnimatedBar pct={80} colors={['#4F46E5', '#7C3AED']} />
            <Text
              style={themeStyle({
                fontWeight: '400',
                fontSize: 11,
                color: '#4B5563',
                marginTop: 6,
              })}
            >
              120 XP to reach Level 8 🚀
            </Text>
          </View>
          <View style={themeStyle({ flexDirection: 'row', gap: 10, marginTop: 14 })}>
            <StatMini
              val={String(enrollments?.length || '0')}
              label="Enrolled"
              icon={<BookOpen size={14} color="#818CF8" />}
              delay={200}
            />

            <StatMini
              val="12h"
              label="Learned"
              icon={<Clock size={14} color="#F59E0B" />}
              delay={280}
            />

            <StatMini
              val="3"
              label="Completed"
              icon={<Award size={14} color="#10B981" />}
              delay={360}
            />

            <StatMini
              val="#42"
              label="Rank"
              icon={<Target size={14} color="#EF4444" />}
              delay={440}
            />
          </View>
        </LinearGradient>
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      >
        {/* Weekly Goal */}
        <View style={themeStyle({ marginHorizontal: 20, marginBottom: 24, marginTop: 4 })}>
          <View
            style={themeStyle({
              backgroundColor: '#1A1A2E',
              borderRadius: 20,
              padding: 18,
              borderWidth: 1,
              borderColor: '#2D2D4E',
            })}
          >
            <View
              style={themeStyle({
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 14,
              })}
            >
              <View style={themeStyle({ flexDirection: 'row', alignItems: 'center', gap: 10 })}>
                <View
                  style={themeStyle({
                    width: 38,
                    height: 38,
                    borderRadius: 12,
                    backgroundColor: '#2D1A00',
                    alignItems: 'center',
                    justifyContent: 'center',
                  })}
                >
                  <Trophy size={18} color="#F59E0B" />
                </View>
                <View>
                  <Text style={themeStyle({ fontWeight: '700', fontSize: 15, color: '#F1F5F9' })}>
                    Weekly Goal
                  </Text>
                  <Text style={themeStyle({ fontWeight: '400', fontSize: 11, color: '#4B5563' })}>
                    2h of 5h completed
                  </Text>
                </View>
              </View>
              <Text style={themeStyle({ fontWeight: '800', fontSize: 24, color: '#F59E0B' })}>
                40%
              </Text>
            </View>
            <AnimatedBar pct={40} colors={['#F59E0B', '#EF4444']} />
            <Text
              style={themeStyle({
                fontWeight: '500',
                fontSize: 11,
                color: '#4B5563',
                marginTop: 8,
              })}
            >
              🏆 Earn "Career Rocket" badge on completion
            </Text>
          </View>
        </View>

        {/* Continue Learning */}
        <View style={themeStyle({ paddingHorizontal: 20, marginBottom: 24 })}>
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
                onPress={() => router.push('/' as any)}
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
            enrollments.map((item: any, index: number) => (
              <EnrollCard key={item.id} item={item} index={index} onContinue={() => {}} />
            ))
          )}
        </View>

        {/* Roadmap */}
        <View style={themeStyle({ paddingHorizontal: 20, marginBottom: 24 })}>
          <Text
            style={themeStyle({
              fontWeight: '700',
              fontSize: 18,
              color: '#F1F5F9',
              marginBottom: 14,
            })}
          >
            SDE Roadmap
          </Text>
          <View
            style={themeStyle({
              backgroundColor: '#1A1A2E',
              borderRadius: 20,
              padding: 18,
              borderWidth: 1,
              borderColor: '#2D2D4E',
            })}
          >
            {ROADMAP.map((item, i) => (
              <RoadmapStep key={i} item={item} index={i} />
            ))}
          </View>
        </View>

        {/* Badges */}
        <View style={themeStyle({ paddingHorizontal: 20 })}>
          <Text
            style={themeStyle({
              fontWeight: '700',
              fontSize: 18,
              color: '#F1F5F9',
              marginBottom: 14,
            })}
          >
            Your Badges
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={themeStyle({ flexGrow: 0 })}
            contentContainerStyle={{ gap: 0 }}
          >
            {BADGES.map((b, i) => (
              <BadgeItem key={i} badge={b} index={i} />
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}
