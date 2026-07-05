/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  FlatList,
  Animated,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, Bell, Star, Clock, ChevronRight, Flame, Users, Play } from 'lucide-react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useQuery } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useAppTheme, themeStyle } from '@/utils/theme';

const { width: W } = Dimensions.get('window');

const CATEGORIES = [
  { id: 0, name: 'All', color: '#4F46E5' },
  { id: 1, name: 'SDE', color: '#0EA5E9' },
  { id: 2, name: 'Aptitude', color: '#8B5CF6' },
  { id: 3, name: 'UPSC', color: '#F59E0B' },
  { id: 4, name: 'Banking', color: '#10B981' },
  { id: 5, name: 'CAT/MBA', color: '#EF4444' },
  { id: 6, name: 'Soft Skills', color: '#EC4899' },
];

const FEATURED = [
  {
    id: '1',
    title: 'Full Stack SDE BootCamp 2026',
    tag: 'BESTSELLER',
    rating: 4.9,
    students: '12.4K',
    price: 4999,
    img: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900&q=90',
  },
  {
    id: '2',
    title: 'UPSC Civil Services Complete 2026',
    tag: 'PREMIUM',
    rating: 4.9,
    students: '7.8K',
    price: 7999,
    img: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=900&q=90',
  },
  {
    id: '3',
    title: 'Quantitative Aptitude Master',
    tag: 'TOP RATED',
    rating: 4.8,
    students: '9.2K',
    price: 2999,
    img: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=900&q=90',
  },
];

const ALL_COURSES = [
  {
    id: '1',
    title: 'Full Stack SDE BootCamp',
    sub: 'DSA + System Design + Web Dev',
    rating: 4.9,
    duration: '48h',
    price: 4999,
    img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=80',
    tag: 'BESTSELLER',
    tagColor: '#F59E0B',
  },
  {
    id: '2',
    title: 'UPSC Civil Services 2026',
    sub: 'Prelims + Mains + Interview',
    rating: 4.9,
    duration: '120h',
    price: 7999,
    img: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&q=80',
    tag: 'PREMIUM',
    tagColor: '#8B5CF6',
  },
  {
    id: '3',
    title: 'Quantitative Aptitude Master',
    sub: 'Number Theory + Probability',
    rating: 4.8,
    duration: '32h',
    price: 2999,
    img: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&q=80',
    tag: 'TOP RATED',
    tagColor: '#10B981',
  },
  {
    id: '4',
    title: 'IBPS Bank PO Complete Prep',
    sub: 'Reasoning + Quant + English + GA',
    rating: 4.7,
    duration: '60h',
    price: 3499,
    img: 'https://images.unsplash.com/photo-1434626881859-194d67b2b86f?w=400&q=80',
    tag: 'HOT',
    tagColor: '#EF4444',
  },
];

function PulsingDot() {
  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.5, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  return (
    <Animated.View
      style={themeStyle({
        transform: [{ scale: pulse }],
        position: 'absolute',
        top: 8,
        right: 8,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#EF4444',
        borderWidth: 1.5,
        borderColor: '#0A0A0F',
      })}
    />
  );
}

function AnimatedDot({ active }: { active: boolean }) {
  const width = useRef(new Animated.Value(active ? 20 : 6)).current;
  useEffect(() => {
    Animated.spring(width, {
      toValue: active ? 20 : 6,
      useNativeDriver: false,
      tension: 200,
    }).start();
  }, [active]);
  return (
    <Animated.View
      style={themeStyle({
        width,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#4F46E5',
        opacity: active ? 1 : 0.35,
      })}
    />
  );
}

function CourseCard({
  course,
  index,
  onPress,
}: {
  course: any;
  index: number;
  onPress: () => void;
}) {
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(50)).current;
  const scale = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 400,
        delay: index * 80,
        useNativeDriver: true,
      }),
      Animated.spring(slide, {
        toValue: 0,
        tension: 70,
        friction: 10,
        delay: index * 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  return (
    <Animated.View
      style={themeStyle({ opacity: fade, transform: [{ translateY: slide }, { scale }] })}
    >
      <Pressable
        onPressIn={() =>
          Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, tension: 400 }).start()
        }
        onPressOut={() =>
          Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 400 }).start()
        }
        onPress={onPress}
        style={themeStyle({
          flexDirection: 'row',
          backgroundColor: '#1A1A2E',
          borderRadius: 20,
          padding: 12,
          marginBottom: 12,
          gap: 14,
          borderWidth: 1,
          borderColor: '#2D2D4E',
        })}
      >
        <View
          style={themeStyle({
            borderRadius: 14,
            overflow: 'hidden',
            width: 90,
            height: 90,
            flexShrink: 0,
          })}
        >
          <Image
            source={{
              uri:
                course.img ||
                course.thumbnail_url ||
                'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400',
            }}
            style={themeStyle({ width: 90, height: 90 })}
            contentFit="cover"
          />
        </View>
        <View style={themeStyle({ flex: 1, justifyContent: 'space-between', paddingVertical: 2 })}>
          <View>
            {(course.tag || course.level) && (
              <View
                style={themeStyle({
                  backgroundColor: `${course.tagColor || '#4F46E5'}25`,
                  borderRadius: 5,
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  alignSelf: 'flex-start',
                  marginBottom: 4,
                })}
              >
                <Text
                  style={themeStyle({
                    fontWeight: '700',
                    fontSize: 9,
                    color: course.tagColor || '#818CF8',
                    letterSpacing: 0.5,
                  })}
                >
                  {course.tag || course.level}
                </Text>
              </View>
            )}
            <Text
              style={themeStyle({
                fontWeight: '700',
                fontSize: 14,
                color: '#F1F5F9',
                lineHeight: 19,
                marginBottom: 2,
              })}
              numberOfLines={2}
            >
              {course.title}
            </Text>
            {course.sub && (
              <Text
                style={themeStyle({
                  fontWeight: '400',
                  fontSize: 11,
                  color: '#4B5563',
                  marginBottom: 4,
                })}
                numberOfLines={1}
              >
                {course.sub}
              </Text>
            )}
          </View>
          <View
            style={themeStyle({
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            })}
          >
            <View style={themeStyle({ flexDirection: 'row', alignItems: 'center', gap: 8 })}>
              <View style={themeStyle({ flexDirection: 'row', alignItems: 'center', gap: 3 })}>
                <Star size={11} color="#F59E0B" fill="#F59E0B" />
                <Text style={themeStyle({ fontWeight: '700', fontSize: 11, color: '#E2E8F0' })}>
                  {course.rating || '4.8'}
                </Text>
              </View>
              <View style={themeStyle({ flexDirection: 'row', alignItems: 'center', gap: 3 })}>
                <Clock size={11} color="#4B5563" />
                <Text style={themeStyle({ fontWeight: '400', fontSize: 11, color: '#4B5563' })}>
                  {course.duration || 'Self-paced'}
                </Text>
              </View>
            </View>
            <Text style={themeStyle({ fontWeight: '800', fontSize: 15, color: '#818CF8' })}>
              ₹{Number(course.price).toLocaleString('en-IN')}
            </Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

function FeaturedCard({ item, onPress }: { item: (typeof FEATURED)[0]; onPress: () => void }) {
  const cardScale = useRef(new Animated.Value(1)).current;
  return (
    <Pressable
      onPressIn={() =>
        Animated.spring(cardScale, { toValue: 0.975, useNativeDriver: true, tension: 400 }).start()
      }
      onPressOut={() =>
        Animated.spring(cardScale, { toValue: 1, useNativeDriver: true, tension: 400 }).start()
      }
      onPress={onPress}
    >
      <Animated.View
        style={themeStyle({
          width: W - 32,
          borderRadius: 24,
          overflow: 'hidden',
          height: 220,
          transform: [{ scale: cardScale }],
        })}
      >
        <Image
          source={{ uri: item.img }}
          style={themeStyle({ position: 'absolute', width: '100%', height: '100%' })}
          contentFit="cover"
        />

        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.9)']}
          style={themeStyle({ position: 'absolute', bottom: 0, left: 0, right: 0, height: '70%' })}
        />

        <View
          style={themeStyle({
            position: 'absolute',
            top: 14,
            left: 14,
            backgroundColor: '#F59E0B',
            borderRadius: 6,
            paddingHorizontal: 8,
            paddingVertical: 3,
          })}
        >
          <Text
            style={themeStyle({
              fontWeight: '800',
              fontSize: 9,
              color: '#0A0A0F',
              letterSpacing: 1,
            })}
          >
            {item.tag}
          </Text>
        </View>
        <View
          style={themeStyle({
            position: 'absolute',
            top: 10,
            right: 14,
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: 'rgba(255,255,255,0.2)',
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.3)',
          })}
        >
          <Play size={14} color="#FFFFFF" fill="#FFFFFF" />
        </View>
        <View
          style={themeStyle({ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16 })}
        >
          <Text
            style={themeStyle({
              fontWeight: '800',
              fontSize: 17,
              color: '#FFFFFF',
              lineHeight: 22,
              marginBottom: 6,
            })}
            numberOfLines={2}
          >
            {item.title}
          </Text>
          <View
            style={themeStyle({
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            })}
          >
            <View style={themeStyle({ flexDirection: 'row', alignItems: 'center', gap: 12 })}>
              <View style={themeStyle({ flexDirection: 'row', alignItems: 'center', gap: 3 })}>
                <Star size={12} color="#F59E0B" fill="#F59E0B" />
                <Text style={themeStyle({ fontWeight: '700', fontSize: 12, color: '#FFFFFF' })}>
                  {item.rating}
                </Text>
              </View>
              <View style={themeStyle({ flexDirection: 'row', alignItems: 'center', gap: 3 })}>
                <Users size={12} color="#94A3B8" />
                <Text style={themeStyle({ fontWeight: '500', fontSize: 12, color: '#94A3B8' })}>
                  {item.students}
                </Text>
              </View>
            </View>
            <View
              style={themeStyle({
                backgroundColor: '#4F46E5',
                borderRadius: 99,
                paddingHorizontal: 14,
                paddingVertical: 7,
              })}
            >
              <Text style={themeStyle({ fontWeight: '700', fontSize: 12, color: '#FFFFFF' })}>
                ₹{item.price.toLocaleString('en-IN')}
              </Text>
            </View>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}

function StatPill({
  n,
  label,
  color,
  delay,
}: {
  n: string;
  label: string;
  color: string;
  delay: number;
}) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(anim, {
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
        backgroundColor: '#1A1A2E',
        borderRadius: 16,
        paddingVertical: 14,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#2D2D4E',
        opacity: anim,
        transform: [{ scale: anim }],
      })}
    >
      <Text style={themeStyle({ fontWeight: '800', fontSize: 20, color })}>{n}</Text>
      <Text style={themeStyle({ fontWeight: '500', fontSize: 11, color: '#4B5563', marginTop: 2 })}>
        {label}
      </Text>
    </Animated.View>
  );
}

function CategoryPill({
  cat,
  active,
  onPress,
}: {
  cat: (typeof CATEGORIES)[0];
  active: boolean;
  onPress: () => void;
}) {
  const sc = useRef(new Animated.Value(1)).current;
  return (
    <Pressable
      onPressIn={() =>
        Animated.spring(sc, { toValue: 0.92, useNativeDriver: true, tension: 400 }).start()
      }
      onPressOut={() =>
        Animated.spring(sc, { toValue: 1, useNativeDriver: true, tension: 400 }).start()
      }
      onPress={onPress}
    >
      <Animated.View
        style={themeStyle({
          paddingHorizontal: 18,
          paddingVertical: 10,
          borderRadius: 99,
          marginRight: 6,
          backgroundColor: active ? cat.color : '#1A1A2E',
          borderWidth: 1,
          borderColor: active ? cat.color : '#2D2D4E',
          transform: [{ scale: sc }],
        })}
      >
        <Text
          style={themeStyle({
            fontWeight: '700',
            fontSize: 13,
            color: active ? '#FFFFFF' : '#64748B',
          })}
        >
          {cat.name}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const theme = useAppTheme();
  const [activeCategory, setActiveCategory] = useState(0);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const headerFade = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(-24)).current;
  const streakBounce = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerFade, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(headerSlide, {
        toValue: 0,
        tension: 80,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(streakBounce, { toValue: -3, duration: 400, useNativeDriver: true }),
          Animated.spring(streakBounce, {
            toValue: 0,
            tension: 300,
            friction: 8,
            useNativeDriver: true,
          }),
        ]),
        { iterations: 3 }
      ).start();
    });
  }, []);

  const { data: apiCourses } = useQuery({
    queryKey: ['courses'],
    retry: false,
    queryFn: async () => {
      const res = await fetch('/api/courses');
      if (!res.ok) throw new Error('failed');
      return res.json();
    },
  });

  const courses =
    apiCourses && apiCourses.length > 0
      ? apiCourses.map((c: any) => ({ ...c, id: String(c.id), img: c.thumbnail_url }))
      : ALL_COURSES;

  return (
    <View style={themeStyle({ flex: 1, backgroundColor: '#0A0A0F' })}>
      <StatusBar style={theme.statusBar} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      >
        {/* HEADER */}
        <Animated.View
          style={themeStyle({
            opacity: headerFade,
            transform: [{ translateY: headerSlide }],
            paddingTop: insets.top + 8,
            paddingHorizontal: 20,
            paddingBottom: 20,
          })}
        >
          <View
            style={themeStyle({
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 18,
            })}
          >
            <View style={themeStyle({ flexDirection: 'row', alignItems: 'center', gap: 10 })}>
              <View
                style={themeStyle({
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  backgroundColor: '#F59E0B',
                  alignItems: 'center',
                  justifyContent: 'center',
                })}
              >
                <Text style={themeStyle({ fontWeight: '900', fontSize: 13, color: '#0A0A0F' })}>
                  IA
                </Text>
              </View>
              <View>
                <Text
                  style={themeStyle({
                    fontWeight: '800',
                    fontSize: 18,
                    color: theme.text,
                    letterSpacing: -0.3,
                  })}
                >
                  IAs Academy
                </Text>
                <Animated.View
                  style={themeStyle({
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 4,
                    transform: [{ translateY: streakBounce }],
                  })}
                >
                  <Flame size={10} color="#F59E0B" />
                  <Text style={themeStyle({ fontWeight: '700', fontSize: 10, color: '#F59E0B' })}>
                    7 day streak
                  </Text>
                </Animated.View>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => router.push('/notifications' as any)}
              style={themeStyle({
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: '#1A1A2E',
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: '#2D2D4E',
              })}
            >
              <Bell size={18} color="#A5B4FC" />
              <PulsingDot />
            </TouchableOpacity>
          </View>
          <View
            style={themeStyle({
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#1A1A2E',
              borderRadius: 16,
              paddingHorizontal: 16,
              height: 52,
              gap: 10,
              borderWidth: 1,
              borderColor: '#2D2D4E',
            })}
          >
            <Search size={18} color="#4B5563" />
            <TextInput
              placeholder="Search courses, topics, exams..."
              placeholderTextColor="#374151"
              style={themeStyle({ flex: 1, fontSize: 14, color: '#E2E8F0' })}
            />
          </View>
        </Animated.View>

        {/* FEATURED CAROUSEL — use FeaturedCard component in renderItem */}
        <View style={themeStyle({ marginBottom: 28 })}>
          <FlatList
            data={FEATURED}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            snapToInterval={W - 32}
            decelerationRate="fast"
            contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
            onMomentumScrollEnd={(e) =>
              setFeaturedIndex(Math.round(e.nativeEvent.contentOffset.x / (W - 32)))
            }
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <FeaturedCard item={item} onPress={() => router.push(`/course/${item.id}` as any)} />
            )}
          />

          <View
            style={themeStyle({
              flexDirection: 'row',
              justifyContent: 'center',
              gap: 6,
              marginTop: 12,
            })}
          >
            {FEATURED.map((_, i) => (
              <AnimatedDot key={i} active={i === featuredIndex} />
            ))}
          </View>
        </View>

        {/* STATS — use StatPill components */}
        <View
          style={themeStyle({
            flexDirection: 'row',
            paddingHorizontal: 20,
            gap: 10,
            marginBottom: 28,
          })}
        >
          <StatPill n="50K+" label="Students" color="#818CF8" delay={200} />
          <StatPill n="120+" label="Courses" color="#F59E0B" delay={300} />
          <StatPill n="95%" label="Placed" color="#10B981" delay={400} />
        </View>

        {/* CATEGORIES — use CategoryPill components */}
        <View style={themeStyle({ marginBottom: 28 })}>
          <Text
            style={themeStyle({
              fontWeight: '700',
              fontSize: 18,
              color: '#F1F5F9',
              paddingHorizontal: 20,
              marginBottom: 14,
            })}
          >
            Categories
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={themeStyle({ flexGrow: 0 })}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
          >
            {CATEGORIES.map((cat) => (
              <CategoryPill
                key={cat.id}
                cat={cat}
                active={activeCategory === cat.id}
                onPress={() => setActiveCategory(cat.id)}
              />
            ))}
          </ScrollView>
        </View>

        {/* COURSE LIST */}
        <View style={themeStyle({ paddingHorizontal: 20 })}>
          <View
            style={themeStyle({
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16,
            })}
          >
            <Text style={themeStyle({ fontWeight: '700', fontSize: 18, color: '#F1F5F9' })}>
              All Courses
            </Text>
            <TouchableOpacity
              style={themeStyle({ flexDirection: 'row', alignItems: 'center', gap: 4 })}
            >
              <Text style={themeStyle({ fontWeight: '600', fontSize: 13, color: '#818CF8' })}>
                See All
              </Text>
              <ChevronRight size={14} color="#818CF8" />
            </TouchableOpacity>
          </View>
          {courses.map((course: any, index: number) => (
            <CourseCard
              key={course.id}
              course={course}
              index={index}
              onPress={() => router.push(`/course/${course.id}` as any)}
            />
          ))}
        </View>

        {/* CTA */}
        <View style={themeStyle({ paddingHorizontal: 20, marginTop: 8 })}>
          <LinearGradient
            colors={['#4F46E5', '#7C3AED']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={themeStyle({
              borderRadius: 24,
              padding: 24,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            })}
          >
            <View style={themeStyle({ flex: 1 })}>
              <Text
                style={themeStyle({
                  fontWeight: '800',
                  fontSize: 20,
                  color: '#FFFFFF',
                  lineHeight: 26,
                  marginBottom: 6,
                })}
              >
                Find Your{'\n'}Dream Job 🎯
              </Text>
              <Text
                style={themeStyle({
                  fontWeight: '400',
                  fontSize: 12,
                  color: '#C4B5FD',
                  lineHeight: 18,
                  marginBottom: 14,
                })}
              >
                Get a personalized roadmap for your target company.
              </Text>
              <TouchableOpacity
                style={themeStyle({
                  backgroundColor: '#FFFFFF',
                  borderRadius: 99,
                  paddingHorizontal: 18,
                  paddingVertical: 9,
                  alignSelf: 'flex-start',
                })}
              >
                <Text style={themeStyle({ fontWeight: '800', fontSize: 12, color: '#4F46E5' })}>
                  Take the Quiz →
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={themeStyle({ fontSize: 58, marginLeft: 12 })}>🚀</Text>
          </LinearGradient>
        </View>
      </ScrollView>
    </View>
  );
}
