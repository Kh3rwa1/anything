import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  useWindowDimensions,
  FlatList,
  Animated,
  RefreshControl,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, Bell, ChevronRight, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useQuery } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useAppTheme, themeStyle } from '@/utils/theme';
import { api } from '@/utils/api';
import type { Course } from '@/types';
import {
  CATEGORIES,
  PulsingDot,
  AnimatedDot,
  CourseCard,
  FeaturedCard,
  StatPill,
  CategoryPill,
} from '@/components/home';

// reactive W defined inside components

export default function ExploreScreen() {
  const { width: W } = useWindowDimensions();
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

  const [searchQuery, setSearchQuery] = useState('');

  const { data: apiCourses = [], isLoading, isError, refetch } = useQuery<Course[]>({
    queryKey: ['courses'],
    retry: 2,
    queryFn: () => api('/api/courses'),
  });

  const courses = apiCourses.map((c: Course) => ({
    ...c,
    id: String(c.id),
    img: c.thumbnail_url,
  }));

  const featuredCourses = courses.slice(0, 3).map((c: Course) => ({
    ...c,
    tag: c.category_name?.toUpperCase() || 'COURSE',
  }));

  const filteredCourses = courses.filter((c: Course) => {
    const matchesSearch =
      !searchQuery ||
      c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 0 || Number(c.category_id) === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <View style={themeStyle({ flex: 1, backgroundColor: '#0A0A0F' })}>
      <StatusBar style={theme.statusBar} />
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
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={themeStyle({ flex: 1, fontSize: 14, color: '#E2E8F0' })}
            />
          </View>
          <LinearGradient
            colors={['#302E7A', '#1D1B4D', '#121222']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={themeStyle({
              marginTop: 16,
              borderRadius: 22,
              padding: 18,
              overflow: 'hidden',
              borderWidth: 1,
              borderColor: '#4946A3',
              minHeight: 118,
              justifyContent: 'space-between',
            })}
          >
            <View style={themeStyle({ position: 'absolute', width: 160, height: 160, borderRadius: 80, right: -48, top: -58, backgroundColor: '#7C3AED55' })} />
            <View style={themeStyle({ position: 'absolute', width: 100, height: 100, borderRadius: 50, right: 24, bottom: -56, backgroundColor: '#EC489955' })} />
            <View style={themeStyle({ flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', backgroundColor: '#FFFFFF16', borderRadius: 99, paddingHorizontal: 9, paddingVertical: 4 })}>
              <Sparkles size={11} color="#C4B5FD" />
              <Text style={themeStyle({ color: '#DDD6FE', fontSize: 10, fontWeight: '800', letterSpacing: 0.4 })}>YOUR NEXT BREAKTHROUGH</Text>
            </View>
            <View>
              <Text style={themeStyle({ color: '#FFFFFF', fontSize: 21, lineHeight: 26, fontWeight: '800', letterSpacing: -0.5 })}>Learn something that{`\n`}moves you forward.</Text>
              <Text style={themeStyle({ color: '#C4B5FD', fontSize: 12, lineHeight: 18, marginTop: 6, fontWeight: '500' })}>Short lessons, sharper practice, real confidence.</Text>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* FEATURED CAROUSEL — use FeaturedCard component in renderItem */}
        {featuredCourses.length > 0 && (
          <View style={themeStyle({ marginBottom: 28 })}>
            <FlatList
              data={featuredCourses}
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
              {featuredCourses.map((_, i) => (
                <AnimatedDot key={i} active={i === featuredIndex} />
              ))}
            </View>
          </View>
        )}

        {/* STATS — use StatPill components */}
        <View
          style={themeStyle({
            flexDirection: 'row',
            paddingHorizontal: 20,
            gap: 10,
            marginBottom: 28,
          })}
        >
          <StatPill n={String(courses.length || '—')} label="Courses" color="#F59E0B" delay={200} />
          <StatPill n="Self-paced" label="Learning" color="#818CF8" delay={300} />
          <StatPill n="24/7" label="Support" color="#10B981" delay={400} />
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
              onPress={() => {
                setActiveCategory(0);
                setSearchQuery('');
              }}
              style={themeStyle({ flexDirection: 'row', alignItems: 'center', gap: 4 })}
            >
              <Text style={themeStyle({ fontWeight: '600', fontSize: 13, color: '#818CF8' })}>
                Reset Filters
              </Text>
              <ChevronRight size={14} color="#818CF8" />
            </TouchableOpacity>
          </View>
          {filteredCourses.map((course: Course, index: number) => (
            <CourseCard
              key={course.id}
              course={course}
              index={index}
              onPress={() => router.push(`/course/${course.id}` as any)}
            />
          ))}
          {filteredCourses.length === 0 && (
            <View style={themeStyle({ alignItems: 'center', paddingVertical: 32 })}>
              <Text style={themeStyle({ color: '#4B5563', fontSize: 14 })}>
                No courses match your search or filters.
              </Text>
            </View>
          )}
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
                onPress={() => {
                  Alert.alert('Coming Soon', 'Personalized career roadmaps and quizzes are coming soon!');
                }}
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
