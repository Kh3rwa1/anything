/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  useWindowDimensions,
  Animated,
  Pressable,
  Alert,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeft,
  Star,
  Clock,
  Users,
  Play,
  CheckCircle,
  Lock,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Award,
  Zap,
  Heart,
  Tag,
  X,
  FileText,
  ClipboardCheck,
} from 'lucide-react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useQuery } from '@tanstack/react-query';
import { useAppTheme, themeStyle } from '@/utils/theme';
import { api } from '@/utils/api';
import { VideoPlayerContainer } from '@/components/VideoPlayerContainer';

// reactive W defined inside component

const TABS = ['overview', 'curriculum', 'tests', 'instructor'] as const;
type Tab = (typeof TABS)[number];

function InfoChip({ icon, text, delay }: { icon: React.ReactNode; text: string; delay: number }) {
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
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#1A1A2E',
        borderRadius: 99,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderWidth: 1,
        borderColor: '#2D2D4E',
        opacity: a,
        transform: [{ scale: a }],
      })}
    >
      {icon}
      <Text style={themeStyle({ fontWeight: '600', fontSize: 11, color: '#94A3B8' })}>{text}</Text>
    </Animated.View>
  );
}

function SkillItem({ skill, index }: { skill: string; index: number }) {
  const a = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(a, {
      toValue: 1,
      tension: 80,
      friction: 8,
      delay: index * 60,
      useNativeDriver: true,
    }).start();
  }, []);
  return (
    <Animated.View
      style={themeStyle({
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        opacity: a,
        transform: [{ translateX: a.interpolate({ inputRange: [0, 1], outputRange: [-16, 0] }) }],
      })}
    >
      <View
        style={themeStyle({
          width: 22,
          height: 22,
          borderRadius: 11,
          backgroundColor: '#1E1B4B',
          alignItems: 'center',
          justifyContent: 'center',
        })}
      >
        <CheckCircle size={13} color="#818CF8" />
      </View>
      <Text style={themeStyle({ fontWeight: '500', fontSize: 14, color: '#CBD5E1' })}>{skill}</Text>
    </Animated.View>
  );
}

function CurriculumSection({
  sec,
  sIndex,
  openSection,
  setOpenSection,
  onPressLesson,
  activeLessonId,
}: {
  sec: { section: string; lessons: any[] };
  sIndex: number;
  openSection: number | null;
  setOpenSection: (n: number | null) => void;
  onPressLesson: (lesson: any) => void;
  activeLessonId?: string;
}) {
  const a = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(a, {
      toValue: 1,
      tension: 80,
      friction: 8,
      delay: sIndex * 80,
      useNativeDriver: true,
    }).start();
  }, []);
  return (
    <Animated.View
      style={themeStyle({
        opacity: a,
        transform: [{ translateY: a.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
        backgroundColor: '#1A1A2E',
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#2D2D4E',
      })}
    >
      <TouchableOpacity
        onPress={() => setOpenSection(openSection === sIndex ? null : sIndex)}
        style={themeStyle({
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 16,
        })}
      >
        <View>
          <Text style={themeStyle({ fontWeight: '700', fontSize: 14, color: '#F1F5F9' })}>
            {sec.section}
          </Text>
          <Text
            style={themeStyle({ fontWeight: '400', fontSize: 12, color: '#4B5563', marginTop: 2 })}
          >
            {sec.lessons.length} lessons
          </Text>
        </View>
        {openSection === sIndex ? (
          <ChevronUp size={18} color="#818CF8" />
        ) : (
          <ChevronDown size={18} color="#4B5563" />
        )}
      </TouchableOpacity>
      {openSection === sIndex && (
        <View style={themeStyle({ borderTopWidth: 1, borderTopColor: '#111118' })}>
          {sec.lessons.map((lesson, li) => {
            const isActive = activeLessonId && activeLessonId === lesson.id;
            return (
              <TouchableOpacity
                key={li}
                onPress={() => onPressLesson(lesson)}
                style={themeStyle({
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderBottomWidth: li < sec.lessons.length - 1 ? 1 : 0,
                  borderBottomColor: '#111118',
                  backgroundColor: isActive ? 'rgba(79,70,229,0.14)' : 'transparent',
                })}
              >
                <View
                  style={themeStyle({
                    width: 30,
                    height: 30,
                    borderRadius: 15,
                    backgroundColor: isActive ? '#4F46E5' : lesson.free ? '#1E1B4B' : '#2D2D4E',
                    alignItems: 'center',
                    justifyContent: 'center',
                  })}
                >
                  {isActive ? (
                    <Play size={12} color="#FFFFFF" fill="#FFFFFF" />
                  ) : lesson.free ? (
                    <Play size={12} color="#818CF8" fill="#818CF8" />
                  ) : (
                    <Lock size={12} color="#4B5563" />
                  )}
                </View>
                <View style={themeStyle({ flex: 1 })}>
                  <Text
                    style={themeStyle({
                      fontWeight: '500',
                      fontSize: 13,
                      color: isActive ? '#FFFFFF' : lesson.free ? '#E2E8F0' : '#64748B',
                    })}
                  >
                    {lesson.title}
                  </Text>
                  {lesson.free && !isActive && (
                    <Text
                      style={themeStyle({
                        fontWeight: '600',
                        fontSize: 10,
                        color: '#10B981',
                        marginTop: 2,
                      })}
                    >
                      FREE PREVIEW
                    </Text>
                  )}
                </View>
                <Text style={themeStyle({ fontWeight: '400', fontSize: 11, color: '#4B5563' })}>
                  {lesson.dur}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </Animated.View>
  );
}

export default function CourseDetail() {
  const { width: W } = useWindowDimensions();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();
  const [openSection, setOpenSection] = useState<number | null>(0);
  const [tab, setTab] = useState<Tab>('overview');
  const [wishlisted, setWishlisted] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  // Code modal state
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [enrollCode, setEnrollCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const modalSlide = useRef(new Animated.Value(300)).current;
  const modalFade = useRef(new Animated.Value(0)).current;

  // Animation refs — must be declared before any early returns (Rules of Hooks)
  const heroFade = useRef(new Animated.Value(0)).current;
  const contentFade = useRef(new Animated.Value(0)).current;
  const contentSlide = useRef(new Animated.Value(30)).current;
  const playPulse = useRef(new Animated.Value(1)).current;
  const ctaSc = useRef(new Animated.Value(1)).current;
  const heartSc = useRef(new Animated.Value(1)).current;
  const tabIndicator = useRef(new Animated.Value(0)).current;
  const submitSc = useRef(new Animated.Value(1)).current;

  const { data: apiCourse, isLoading: courseLoading } = useQuery<any>({
    queryKey: ['course', id],
    enabled: Boolean(id),
    retry: false,
    queryFn: () => api(`/api/courses?id=${encodeURIComponent(String(id))}`),
  });

  const [activeLesson, setActiveLesson] = useState<any>(null);

  const { data: enrollments = [] } = useQuery<any[]>({
    queryKey: ['my-enrollments'],
    retry: false,
    queryFn: () => api('/api/enroll'),
  });

  const { data: dbLessons = [] } = useQuery<any[]>({
    queryKey: ['course-lessons', id],
    enabled: Boolean(id),
    retry: false,
    queryFn: () => api(`/api/courses/lessons?course_id=${id}`),
  });

  const { data: mockTests = [], isLoading: testsLoading } = useQuery<any[]>({
    queryKey: ['course-tests', id],
    enabled: Boolean(id),
    retry: false,
    queryFn: () => api(`/api/courses/tests?course_id=${id}`),
  });

  const { data: testAttempts = [] } = useQuery<any[]>({
    queryKey: ['my-test-attempts', id],
    enabled: Boolean(id) && enrollments.some((e: any) => String(e.course_id) === String(id)),
    retry: false,
    queryFn: () => api(`/api/courses/tests/attempts?course_id=${id}`),
  });

  useEffect(() => {
    if (!courseLoading && apiCourse) {
      Animated.sequence([
        Animated.timing(heroFade, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.parallel([
          Animated.timing(contentFade, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.spring(contentSlide, {
            toValue: 0,
            tension: 80,
            friction: 10,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
      Animated.loop(
        Animated.sequence([
          Animated.timing(playPulse, { toValue: 1.14, duration: 800, useNativeDriver: true }),
          Animated.timing(playPulse, { toValue: 1, duration: 800, useNativeDriver: true }),
        ])
      ).start();
    }
  }, [courseLoading, apiCourse]);

  if (courseLoading || !apiCourse) {
    return (
      <View style={themeStyle({ flex: 1, backgroundColor: '#0A0A0F', justifyContent: 'center', alignItems: 'center' })}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  const enrollmentCount = enrollments.filter((e: any) => String(e.course_id) === String(id)).length;

  const course = {
    title: apiCourse.title,
    instructor: apiCourse.instructor || 'IAs Academy Faculty',
    instructorRole: apiCourse.instructor_role || apiCourse.instructor || 'Instructor',
    rating: apiCourse.rating || null,
    reviews: apiCourse.review_count || null,
    students: enrollmentCount > 0 ? `${enrollmentCount}` : null,
    duration: apiCourse.duration || 'Self-paced',
    lessons: Number(apiCourse.lesson_count) || dbLessons.length,
    level: apiCourse.level || 'General',
    price: Number(apiCourse.price) || 0,
    orig: apiCourse.original_price ? Number(apiCourse.original_price) : null,
    img: apiCourse.thumbnail_url || 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400',
    about: apiCourse.description || 'Course details are being prepared.',
    tag: apiCourse.category_name?.toUpperCase() || 'COURSE',
    skills: apiCourse.skills || [],
    instructorBio: apiCourse.instructor_bio || null,
  };

  const discount = course.orig && course.orig > course.price ? Math.round((1 - course.price / course.orig) * 100) : 0;
  const isEnrolled = enrollments.some((e: any) => String(e.course_id) === String(id));

  const displayCurriculum = [
    {
      section: 'Course Syllabus',
      lessons: dbLessons.map((l: any, index: number) => ({
        id: l.id || l.$id,
        title: l.title,
        dur: '',
        free: index === 0 && !isEnrolled,
        video_url: l.video_url,
        content: l.content,
      })),
    }
  ];


  const openModal = () => {
    setEnrollCode('');
    setCodeError('');
    setShowCodeModal(true);
    Animated.parallel([
      Animated.timing(modalFade, { toValue: 1, duration: 250, useNativeDriver: true }),
      Animated.spring(modalSlide, { toValue: 0, tension: 80, friction: 12, useNativeDriver: true }),
    ]).start();
  };

  const closeModal = () => {
    Animated.parallel([
      Animated.timing(modalFade, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(modalSlide, { toValue: 300, duration: 200, useNativeDriver: true }),
    ]).start(() => setShowCodeModal(false));
  };

  const changeTab = (t: Tab) => {
    setTab(t);
    const idx = TABS.indexOf(t);
    Animated.spring(tabIndicator, {
      toValue: idx,
      tension: 200,
      friction: 15,
      useNativeDriver: false,
    }).start();
  };

  const handleWishlist = () => {
    setWishlisted((w) => !w);
    Animated.sequence([
      Animated.spring(heartSc, { toValue: 1.5, tension: 400, friction: 6, useNativeDriver: true }),
      Animated.spring(heartSc, { toValue: 1, tension: 400, friction: 6, useNativeDriver: true }),
    ]).start();
  };

  const handleEnroll = () => {
    Animated.sequence([
      Animated.spring(ctaSc, { toValue: 0.93, useNativeDriver: true, tension: 400 }),
      Animated.spring(ctaSc, { toValue: 1, useNativeDriver: true, tension: 400 }),
    ]).start();
    openModal();
  };

  const handleSubmitCode = async () => {
    const trimmed = enrollCode.trim();
    if (!trimmed) {
      setCodeError('Please enter your enrollment code.');
      return;
    }
    setEnrolling(true);
    setCodeError('');
    Animated.sequence([
      Animated.spring(submitSc, { toValue: 0.94, useNativeDriver: true, tension: 400 }),
      Animated.spring(submitSc, { toValue: 1, useNativeDriver: true, tension: 400 }),
    ]).start();
    try {
      const data = await api<{ already_enrolled?: boolean; discount_pct?: number }>('/api/enroll', {
        method: 'POST',
        body: JSON.stringify({ courseId: id, code: trimmed }),
      });
      closeModal();
      setTimeout(() => {
        const msg = data.already_enrolled
          ? `You're already enrolled in ${course.title}!`
          : (data.discount_pct ?? 0) > 0
            ? `🎉 ${data.discount_pct}% discount applied! You're enrolled in ${course.title}.`
            : `🎉 You've successfully enrolled in ${course.title}.`;
        Alert.alert('Enrolled!', msg, [{ text: 'Start Learning', onPress: () => router.back() }]);
      }, 300);
    } catch (err: any) {
      setCodeError(err?.message || 'Invalid code. Please try again.');
    } finally {
      setEnrolling(false);
    }
  };

  const tabW = (W - 40 - 8) / 4;
  const indicatorLeft = tabIndicator.interpolate({
    inputRange: [0, 1, 2, 3],
    outputRange: [4, tabW + 4, tabW * 2 + 4, tabW * 3 + 4],
  });

  return (
    <View style={themeStyle({ flex: 1, backgroundColor: '#0A0A0F' })}>
      <StatusBar style="light" />

      {/* Hero */}
      <Animated.View style={themeStyle({ opacity: heroFade, height: 260, position: 'relative' })}>
        {activeLesson?.video_url ? (
          <VideoPlayerContainer videoUrl={activeLesson.video_url} />
        ) : (
          <Image
            source={{ uri: course.img }}
            style={themeStyle({ width: '100%', height: '100%' })}
            contentFit="cover"
          />
        )}

        <LinearGradient
          colors={['rgba(0,0,0,0.5)', 'transparent', 'rgba(10,10,15,0.97)']}
          style={themeStyle({ position: 'absolute', inset: 0 })}
        />

        <TouchableOpacity
          onPress={() => router.back()}
          style={themeStyle({
            position: 'absolute',
            top: insets.top + 8,
            left: 16,
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: 'rgba(0,0,0,0.55)',
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.15)',
          })}
        >
          <ArrowLeft size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <View
          style={themeStyle({
            position: 'absolute',
            top: insets.top + 14,
            right: 56,
            backgroundColor: '#F59E0B',
            borderRadius: 6,
            paddingHorizontal: 8,
            paddingVertical: 3,
          })}
        >
          <Text
            style={themeStyle({
              fontWeight: '800',
              fontSize: 10,
              color: '#0A0A0F',
              letterSpacing: 1,
            })}
          >
            {course.tag}
          </Text>
        </View>
        <Pressable
          onPress={handleWishlist}
          style={themeStyle({
            position: 'absolute',
            top: insets.top + 10,
            right: 16,
            width: 38,
            height: 38,
            borderRadius: 19,
            backgroundColor: 'rgba(0,0,0,0.5)',
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.15)',
          })}
        >
          <Animated.View style={themeStyle({ transform: [{ scale: heartSc }] })}>
            <Heart
              size={18}
              color={wishlisted ? '#EF4444' : '#FFFFFF'}
              fill={wishlisted ? '#EF4444' : 'transparent'}
            />
          </Animated.View>
        </Pressable>
        {!activeLesson && (
          <Animated.View
            style={themeStyle({
              position: 'absolute',
              bottom: 20,
              left: W / 2 - 28,
              transform: [{ scale: playPulse }],
            })}
          >
            <TouchableOpacity
              onPress={() => {
                if (!isEnrolled) {
                  Alert.alert('Enrollment Required', 'Please enroll in this course to watch lessons.');
                  return;
                }
                const firstLesson = displayCurriculum[0]?.lessons[0];
                if (firstLesson) {
                  setActiveLesson(firstLesson);
                } else {
                  Alert.alert('No Lessons', 'This course does not have any lessons available.');
                }
              }}
              style={themeStyle({
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: 'rgba(79,70,229,0.92)',
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 2,
                borderColor: 'rgba(255,255,255,0.3)',
              })}
            >
              <Play size={22} color="#FFFFFF" fill="#FFFFFF" />
            </TouchableOpacity>
          </Animated.View>
        )}
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <Animated.View
          style={themeStyle({
            padding: 20,
            opacity: contentFade,
            transform: [{ translateY: contentSlide }],
          })}
        >
          {activeLesson && (
            <View
              style={themeStyle({
                backgroundColor: '#1E1B4B',
                borderRadius: 20,
                padding: 16,
                marginBottom: 20,
                borderWidth: 1,
                borderColor: '#4F46E5',
              })}
            >
              <View style={themeStyle({ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 })}>
                <View style={themeStyle({ flex: 1, marginRight: 8 })}>
                  <Text style={themeStyle({ fontWeight: '700', fontSize: 10, color: '#818CF8', textTransform: 'uppercase', letterSpacing: 0.5 })}>
                    Now Playing
                  </Text>
                  <Text style={themeStyle({ fontWeight: '800', fontSize: 15, color: '#FFFFFF', marginTop: 2 })}>
                    {activeLesson.title}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setActiveLesson(null)}
                  style={themeStyle({
                    padding: 4,
                    borderRadius: 99,
                    backgroundColor: '#2D2D4E',
                  })}
                >
                  <X size={14} color="#A5B4FC" />
                </TouchableOpacity>
              </View>

              {activeLesson.content ? (
                <View style={themeStyle({ borderTopWidth: 1, borderTopColor: '#2D2D4E', paddingTop: 10, marginBottom: 12 })}>
                  <Text style={themeStyle({ fontWeight: '700', fontSize: 12, color: '#A5B4FC', marginBottom: 4 })}>
                    Lesson Notes & Description:
                  </Text>
                  <Text style={themeStyle({ fontWeight: '400', fontSize: 13, color: '#CBD5E1', lineHeight: 18 })}>
                    {activeLesson.content}
                  </Text>
                </View>
              ) : null}

              <TouchableOpacity
                onPress={() => {
                  const pdfUrl = activeLesson.pdf_url || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
                  Linking.openURL(pdfUrl).catch(() => {
                    Alert.alert('Error', 'Unable to open PDF link.');
                  });
                }}
                style={themeStyle({
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  backgroundColor: '#4F46E5',
                  borderRadius: 12,
                  paddingVertical: 10,
                })}
              >
                <FileText size={14} color="#FFFFFF" />
                <Text style={themeStyle({ fontWeight: '700', fontSize: 13, color: '#FFFFFF' })}>
                  Download PDF Study Material
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <Text
            style={themeStyle({
              fontWeight: '800',
              fontSize: 22,
              color: theme.text,
              lineHeight: 30,
              marginBottom: 8,
            })}
          >
            {course.title}
          </Text>
          <View
            style={themeStyle({
              flexDirection: 'row',
              alignItems: 'center',
              gap: 14,
              marginBottom: 16,
            })}
          >
            <View style={themeStyle({ flexDirection: 'row', alignItems: 'center', gap: 4 })}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={13} color="#F59E0B" fill="#F59E0B" />
              ))}
              <Text
                style={themeStyle({
                  fontWeight: '700',
                  fontSize: 13,
                  color: '#F59E0B',
                  marginLeft: 4,
                })}
              >
                {course.rating}
              </Text>
              <Text style={themeStyle({ fontWeight: '400', fontSize: 12, color: '#4B5563' })}>
                ({(course.reviews ?? 0).toLocaleString()})
              </Text>
            </View>
            <View style={themeStyle({ flexDirection: 'row', alignItems: 'center', gap: 4 })}>
              <Users size={13} color="#4B5563" />
              <Text style={themeStyle({ fontWeight: '500', fontSize: 12, color: '#4B5563' })}>
                {course.students} students
              </Text>
            </View>
          </View>

          {/* Chips */}
          <View
            style={themeStyle({ flexDirection: 'row', gap: 8, marginBottom: 24, flexWrap: 'wrap' })}
          >
            <InfoChip
              icon={<Clock size={13} color="#818CF8" />}
              text={course.duration}
              delay={200}
            />

            <InfoChip
              icon={<BookOpen size={13} color="#10B981" />}
              text={`${course.lessons} lessons`}
              delay={260}
            />

            <InfoChip icon={<Zap size={13} color="#F59E0B" />} text={course.level} delay={320} />
            <InfoChip icon={<Award size={13} color="#EF4444" />} text="Certificate" delay={380} />
          </View>

          {/* Animated Sliding Tabs */}
          <View
            style={themeStyle({
              backgroundColor: '#1A1A2E',
              borderRadius: 14,
              padding: 4,
              marginBottom: 24,
              borderWidth: 1,
              borderColor: '#2D2D4E',
              position: 'relative',
            })}
          >
            <Animated.View
              style={themeStyle({
                position: 'absolute',
                top: 4,
                left: indicatorLeft,
                width: tabW,
                height: 38,
                backgroundColor: '#4F46E5',
                borderRadius: 10,
              })}
            />

            <View style={themeStyle({ flexDirection: 'row' })}>
              {TABS.map((t) => (
                <TouchableOpacity
                  key={t}
                  onPress={() => changeTab(t)}
                  style={themeStyle({
                    flex: 1,
                    paddingVertical: 9,
                    borderRadius: 10,
                    alignItems: 'center',
                  })}
                >
                  <Text
                    style={themeStyle({
                      fontWeight: '700',
                      fontSize: 12,
                      color: tab === t ? '#FFFFFF' : '#4B5563',
                      textTransform: 'capitalize',
                    })}
                  >
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {tab === 'overview' && (
            <View>
              <Text
                style={themeStyle({
                  fontWeight: '700',
                  fontSize: 16,
                  color: '#F1F5F9',
                  marginBottom: 10,
                })}
              >
                About This Course
              </Text>
              <Text
                style={themeStyle({
                  fontWeight: '400',
                  fontSize: 14,
                  color: '#64748B',
                  lineHeight: 22,
                  marginBottom: 24,
                })}
              >
                {course.about}
              </Text>
              <Text
                style={themeStyle({
                  fontWeight: '700',
                  fontSize: 16,
                  color: '#F1F5F9',
                  marginBottom: 12,
                })}
              >
                What You'll Learn
              </Text>
              <View style={themeStyle({ gap: 10 })}>
                {course.skills.map((skill: string, i: number) => (
                  <SkillItem key={i} skill={skill} index={i} />
                ))}
              </View>
              <View
                style={themeStyle({
                  marginTop: 24,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 14,
                  backgroundColor: '#1A1A2E',
                  borderRadius: 18,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: '#2D2D4E',
                })}
              >
                <View
                  style={themeStyle({
                    width: 52,
                    height: 52,
                    borderRadius: 26,
                    backgroundColor: '#4F46E5',
                    alignItems: 'center',
                    justifyContent: 'center',
                  })}
                >
                  <Text style={themeStyle({ fontWeight: '800', fontSize: 18, color: '#FFFFFF' })}>
                    {course.instructor[0]}
                  </Text>
                </View>
                <View>
                  <Text style={themeStyle({ fontWeight: '700', fontSize: 15, color: '#F1F5F9' })}>
                    {course.instructor}
                  </Text>
                  <Text style={themeStyle({ fontWeight: '400', fontSize: 12, color: '#64748B' })}>
                    {course.instructorRole}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {tab === 'curriculum' && (
            <View style={themeStyle({ gap: 10 })}>
              {displayCurriculum.map((sec, si) => (
                <CurriculumSection
                  key={si}
                  sec={sec}
                  sIndex={si}
                  openSection={openSection}
                  setOpenSection={setOpenSection}
                  onPressLesson={(lesson) => {
                    if (isEnrolled || lesson.free) {
                      setActiveLesson(lesson);
                    } else {
                      Alert.alert('Enrollment Required', 'Please enroll in this course to watch this lesson.');
                    }
                  }}
                  activeLessonId={activeLesson?.id}
                />
              ))}
            </View>
          )}

          {tab === 'tests' && (
            <View style={themeStyle({ gap: 14 })}>
              {testsLoading ? (
                <ActivityIndicator color="#4F46E5" style={{ marginVertical: 30 }} />
              ) : mockTests.length === 0 ? (
                <View style={themeStyle({ alignItems: 'center', paddingVertical: 40, backgroundColor: '#1A1A2E', borderRadius: 20, borderWidth: 1, borderColor: '#2D2D4E' })}>
                  <Text style={themeStyle({ fontSize: 40, marginBottom: 8 })}>📝</Text>
                  <Text style={themeStyle({ fontWeight: '700', fontSize: 15, color: '#FFFFFF' })}>No mock tests yet</Text>
                  <Text style={themeStyle({ fontWeight: '400', fontSize: 12, color: '#4B5563', textAlign: 'center', paddingHorizontal: 20 })}>
                    Tests are being prepared for this course. Check back soon!
                  </Text>
                </View>
              ) : (
                mockTests.map((test) => {
                  const attempt = testAttempts.find((a: any) => String(a.test_id) === String(test.id));
                  return (
                    <View
                      key={test.id}
                      style={themeStyle({
                        backgroundColor: '#1A1A2E',
                        borderRadius: 18,
                        padding: 16,
                        borderWidth: 1,
                        borderColor: '#2D2D4E',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      })}
                    >
                      <View style={themeStyle({ flex: 1, marginRight: 16 })}>
                        <Text style={themeStyle({ fontWeight: '700', fontSize: 14, color: '#FFFFFF' })}>
                          {test.title}
                        </Text>
                        <View style={themeStyle({ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 6 })}>
                          <View style={themeStyle({ flexDirection: 'row', alignItems: 'center', gap: 4 })}>
                            <Clock size={12} color="#4B5563" />
                            <Text style={themeStyle({ fontWeight: '400', fontSize: 11, color: '#4B5563' })}>
                              {test.duration_minutes} Mins
                            </Text>
                          </View>
                          <View style={themeStyle({ flexDirection: 'row', alignItems: 'center', gap: 4 })}>
                            <ClipboardCheck size={12} color="#4B5563" />
                            <Text style={themeStyle({ fontWeight: '400', fontSize: 11, color: '#4B5563' })}>
                              {test.question_count} Questions
                            </Text>
                          </View>
                        </View>

                        {attempt && (
                          <View style={themeStyle({ alignSelf: 'flex-start', backgroundColor: '#10B98120', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, marginTop: 10 })}>
                            <Text style={themeStyle({ fontWeight: '700', fontSize: 10, color: '#10B981' })}>
                              PREVIOUS SCORE: {attempt.score}%
                            </Text>
                          </View>
                        )}
                      </View>

                      {isEnrolled ? (
                        <View style={themeStyle({ gap: 8 })}>
                          {attempt ? (
                            <>
                              <TouchableOpacity
                                onPress={() => router.push(`/test/result?testId=${test.id}&attemptId=${attempt.id}` as any)}
                                style={themeStyle({
                                  backgroundColor: '#2D2D4E',
                                  borderRadius: 10,
                                  paddingHorizontal: 16,
                                  paddingVertical: 8,
                                  alignItems: 'center',
                                })}
                              >
                                <Text style={themeStyle({ fontWeight: '700', fontSize: 12, color: '#A5B4FC' })}>
                                  Review
                                </Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() => router.push(`/test/${test.id}` as any)}
                                style={themeStyle({
                                  backgroundColor: 'rgba(79,70,229,0.15)',
                                  borderRadius: 10,
                                  paddingHorizontal: 16,
                                  paddingVertical: 6,
                                  alignItems: 'center',
                                })}
                              >
                                <Text style={themeStyle({ fontWeight: '600', fontSize: 11, color: '#818CF8' })}>
                                  Retake
                                </Text>
                              </TouchableOpacity>
                            </>
                          ) : (
                            <TouchableOpacity
                              onPress={() => router.push(`/test/${test.id}` as any)}
                              style={themeStyle({
                                backgroundColor: '#4F46E5',
                                borderRadius: 10,
                                paddingHorizontal: 16,
                                paddingVertical: 10,
                                alignItems: 'center',
                              })}
                            >
                              <Text style={themeStyle({ fontWeight: '700', fontSize: 12, color: '#FFFFFF' })}>
                                Start Test
                              </Text>
                            </TouchableOpacity>
                          )}
                        </View>
                      ) : (
                        <View style={themeStyle({ width: 32, height: 32, borderRadius: 16, backgroundColor: '#2D2D4E', alignItems: 'center', justifyContent: 'center' })}>
                          <Lock size={14} color="#4B5563" />
                        </View>
                      )}
                    </View>
                  );
                })
              )}
            </View>
          )}

          {tab === 'instructor' && (
            <View style={themeStyle({ gap: 16 })}>
              <View
                style={themeStyle({
                  alignItems: 'center',
                  backgroundColor: '#1A1A2E',
                  borderRadius: 20,
                  padding: 24,
                  borderWidth: 1,
                  borderColor: '#2D2D4E',
                })}
              >
                <View
                  style={themeStyle({
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    backgroundColor: '#4F46E5',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 12,
                  })}
                >
                  <Text style={themeStyle({ fontWeight: '800', fontSize: 28, color: '#FFFFFF' })}>
                    {course.instructor[0]}
                  </Text>
                </View>
                <Text
                  style={themeStyle({
                    fontWeight: '800',
                    fontSize: 18,
                    color: '#FFFFFF',
                    marginBottom: 4,
                  })}
                >
                  {course.instructor}
                </Text>
                <Text
                  style={themeStyle({
                    fontWeight: '400',
                    fontSize: 13,
                    color: '#818CF8',
                    marginBottom: 16,
                  })}
                >
                  {course.instructorRole}
                </Text>
                <View style={themeStyle({ flexDirection: 'row', gap: 20 })}>
                  {[
                    { n: '4.8', l: 'Rating' },
                    { n: '100+', l: 'Students' },
                    { n: String(course.lessons), l: 'Lessons' },
                  ].map((s, i) => (
                    <View key={i} style={themeStyle({ alignItems: 'center' })}>
                      <Text
                        style={themeStyle({ fontWeight: '800', fontSize: 18, color: '#F1F5F9' })}
                      >
                        {s.n}
                      </Text>
                      <Text
                        style={themeStyle({ fontWeight: '400', fontSize: 11, color: '#4B5563' })}
                      >
                        {s.l}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
              <View
                style={themeStyle({
                  backgroundColor: '#1A1A2E',
                  borderRadius: 16,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: '#2D2D4E',
                })}
              >
                <Text
                  style={themeStyle({
                    fontWeight: '700',
                    fontSize: 15,
                    color: '#F1F5F9',
                    marginBottom: 10,
                  })}
                >
                  About Instructor
                </Text>
                <Text
                  style={themeStyle({
                    fontWeight: '400',
                    fontSize: 14,
                    color: '#64748B',
                    lineHeight: 22,
                  })}
                >
                  {course.instructorBio || `${course.instructor} is a dedicated educator focused on making complex concepts approachable through practical, real-world examples.`}
                </Text>
              </View>
            </View>
          )}
        </Animated.View>
      </ScrollView>
 
      {/* Bottom CTA */}
      <View
        style={themeStyle({
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          paddingBottom: insets.bottom + 12,
          paddingTop: 16,
          paddingHorizontal: 20,
          backgroundColor: '#0A0A0F',
          borderTopWidth: 1,
          borderTopColor: '#1A1A2E',
        })}
      >
        <View
          style={themeStyle({
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          })}
        >
          <View>
            <View style={themeStyle({ flexDirection: 'row', alignItems: 'baseline', gap: 8 })}>
              <Text style={themeStyle({ fontWeight: '800', fontSize: 26, color: theme.text })}>
                ₹{course.price.toLocaleString('en-IN')}
              </Text>
              {course.orig != null && (
                <Text
                  style={themeStyle({
                    fontWeight: '400',
                    fontSize: 14,
                    color: '#4B5563',
                    textDecorationLine: 'line-through',
                  })}
                >
                  ₹{course.orig.toLocaleString('en-IN')}
                </Text>
              )}
            </View>
            {discount > 0 && (
              <Text style={themeStyle({ fontWeight: '600', fontSize: 11, color: '#10B981' })}>
                {discount}% off
              </Text>
            )}
          </View>
          <Pressable
            onPressIn={() =>
              Animated.spring(ctaSc, { toValue: 0.94, useNativeDriver: true, tension: 400 }).start()
            }
            onPressOut={() =>
              Animated.spring(ctaSc, { toValue: 1, useNativeDriver: true, tension: 400 }).start()
            }
            onPress={handleEnroll}
          >
            <Animated.View style={themeStyle({ transform: [{ scale: ctaSc }] })}>
              <LinearGradient
                colors={['#4F46E5', '#7C3AED']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={themeStyle({ borderRadius: 16, paddingHorizontal: 28, paddingVertical: 15 })}
              >
                <Text style={themeStyle({ fontWeight: '800', fontSize: 15, color: '#FFFFFF' })}>
                  {enrolling ? 'Enrolling…' : 'Enroll Now'}
                </Text>
              </LinearGradient>
            </Animated.View>
          </Pressable>
        </View>
      </View>

      {/* Enrollment Code Modal */}
      <Modal visible={showCodeModal} transparent animationType="none" onRequestClose={closeModal}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={themeStyle({ flex: 1 })}
        >
          <Animated.View
            style={themeStyle({
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.7)',
              justifyContent: 'flex-end',
              opacity: modalFade,
            })}
          >
            <Pressable style={themeStyle({ flex: 1 })} onPress={closeModal} />
            <Animated.View
              style={themeStyle({
                transform: [{ translateY: modalSlide }],
                backgroundColor: '#111118',
                borderTopLeftRadius: 28,
                borderTopRightRadius: 28,
                paddingHorizontal: 24,
                paddingTop: 12,
                paddingBottom: insets.bottom + 28,
                borderTopWidth: 1,
                borderColor: '#2D2D4E',
              })}
            >
              {/* Handle */}
              <View
                style={themeStyle({
                  width: 40,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: '#2D2D4E',
                  alignSelf: 'center',
                  marginBottom: 20,
                })}
              />

              {/* Close */}
              <TouchableOpacity
                onPress={closeModal}
                style={themeStyle({
                  position: 'absolute',
                  top: 20,
                  right: 24,
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: '#1A1A2E',
                  alignItems: 'center',
                  justifyContent: 'center',
                })}
              >
                <X size={16} color="#64748B" />
              </TouchableOpacity>

              {/* Icon + Title */}
              <View style={themeStyle({ alignItems: 'center', marginBottom: 24 })}>
                <View
                  style={themeStyle({
                    width: 56,
                    height: 56,
                    borderRadius: 18,
                    backgroundColor: '#1E1B4B',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 14,
                  })}
                >
                  <Tag size={26} color="#818CF8" />
                </View>
                <Text
                  style={themeStyle({
                    fontWeight: '800',
                    fontSize: 20,
                    color: theme.text,
                    marginBottom: 6,
                  })}
                >
                  Enter Enrollment Code
                </Text>
                <Text
                  style={themeStyle({
                    fontWeight: '400',
                    fontSize: 13,
                    color: '#4B5563',
                    textAlign: 'center',
                    lineHeight: 19,
                  })}
                >
                  Enter your access code to enroll.{'\n'}Codes are shared by your institution or
                  instructor.
                </Text>
              </View>

              {/* Input */}
              <View
                style={themeStyle({
                  backgroundColor: '#1A1A2E',
                  borderRadius: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 16,
                  height: 56,
                  borderWidth: 1.5,
                  borderColor: codeError ? '#EF4444' : '#2D2D4E',
                  marginBottom: 10,
                })}
              >
                <View style={themeStyle({ marginRight: 10 })}>
                  <Tag size={18} color="#4B5563" />
                </View>
                <TextInput
                  value={enrollCode}
                  onChangeText={(t) => {
                    setEnrollCode(t);
                    setCodeError('');
                  }}
                  placeholder="e.g. WELCOME50"
                  placeholderTextColor="#374151"
                  autoCapitalize="characters"
                  autoCorrect={false}
                  style={themeStyle({
                    flex: 1,
                    fontSize: 16,
                    color: '#F1F5F9',
                    fontWeight: '700',
                    letterSpacing: 1.5,
                  })}
                />

                {enrollCode.length > 0 && (
                  <TouchableOpacity
                    onPress={() => {
                      setEnrollCode('');
                      setCodeError('');
                    }}
                  >
                    <X size={16} color="#4B5563" />
                  </TouchableOpacity>
                )}
              </View>

              {/* Error */}
              {codeError ? (
                <Text
                  style={themeStyle({
                    fontWeight: '500',
                    fontSize: 12,
                    color: '#EF4444',
                    marginBottom: 16,
                    marginLeft: 4,
                  })}
                >
                  ⚠ {codeError}
                </Text>
              ) : (
                <Text
                  style={themeStyle({
                    fontWeight: '400',
                    fontSize: 11,
                    color: '#4B5563',
                    marginBottom: 16,
                    marginLeft: 4,
                  })}
                >
                  Enter your promotional code above to claim a discount.
                </Text>
              )}

              {/* Submit */}
              <Pressable
                onPressIn={() =>
                  Animated.spring(submitSc, {
                    toValue: 0.96,
                    useNativeDriver: true,
                    tension: 400,
                  }).start()
                }
                onPressOut={() =>
                  Animated.spring(submitSc, {
                    toValue: 1,
                    useNativeDriver: true,
                    tension: 400,
                  }).start()
                }
                onPress={handleSubmitCode}
                disabled={enrolling}
              >
                <Animated.View style={themeStyle({ transform: [{ scale: submitSc }] })}>
                  <LinearGradient
                    colors={['#4F46E5', '#7C3AED']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={themeStyle({
                      borderRadius: 16,
                      height: 56,
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: enrolling ? 0.7 : 1,
                    })}
                  >
                    <Text style={themeStyle({ fontWeight: '800', fontSize: 16, color: '#FFFFFF' })}>
                      {enrolling ? 'Verifying Code…' : 'Apply Code & Enroll'}
                    </Text>
                  </LinearGradient>
                </Animated.View>
              </Pressable>
            </Animated.View>
          </Animated.View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
