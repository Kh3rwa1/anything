/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
  Pressable,
  Alert,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
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
} from 'lucide-react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useQuery } from '@tanstack/react-query';
import { useAppTheme, themeStyle } from '@/utils/theme';

const { width: W } = Dimensions.get('window');

const COURSES: Record<string, any> = {
  '1': {
    title: 'Full Stack SDE BootCamp 2026',
    instructor: 'Priya Kapoor',
    instructorRole: 'Ex-Google | IIT Bombay',
    rating: 4.9,
    reviews: 2140,
    students: '12.4K',
    duration: '48h',
    lessons: 120,
    level: 'Intermediate',
    price: 4999,
    orig: 9999,
    img: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900&q=90',
    tag: 'BESTSELLER',
    about:
      'Master Data Structures, Algorithms, System Design, and Full Stack Web Development. Crack top tech companies like Google, Amazon, Microsoft and more with our battle-tested curriculum used by 12,000+ placed students.',
    skills: [
      'Data Structures & Algorithms',
      'System Design',
      'React & Node.js',
      'SQL & MongoDB',
      'LLD & HLD',
      'Mock Interviews',
    ],
  },
  '2': {
    title: 'UPSC Civil Services Complete 2026',
    instructor: 'Dr. Ananya Singh',
    instructorRole: 'IAS Officer | IIT Delhi',
    rating: 4.9,
    reviews: 1820,
    students: '7.8K',
    duration: '120h',
    lessons: 280,
    level: 'Advanced',
    price: 7999,
    orig: 14999,
    img: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=900&q=90',
    tag: 'PREMIUM',
    about:
      'Complete UPSC preparation covering Prelims, Mains, and Interview. Daily current affairs, answer writing practice, and 1-on-1 mentorship from an IAS officer.',
    skills: [
      'General Studies I–IV',
      'Current Affairs',
      'Essay Writing',
      'CSAT',
      'Optional Subject',
      'Interview Prep',
    ],
  },
  '3': {
    title: 'Quantitative Aptitude Master',
    instructor: 'Rohit Verma',
    instructorRole: 'CAT 99.8 Percentile',
    rating: 4.8,
    reviews: 1540,
    students: '9.2K',
    duration: '32h',
    lessons: 90,
    level: 'Beginner',
    price: 2999,
    orig: 5999,
    img: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=900&q=90',
    tag: 'TOP RATED',
    about:
      'Master Quantitative Aptitude for CAT, GMAT, banking and campus placements. 5000+ practice problems with detailed video solutions.',
    skills: [
      'Number Theory',
      'Algebra',
      'Geometry',
      'Probability',
      'Data Interpretation',
      'Speed Maths',
    ],
  },
  '4': {
    title: 'IBPS Bank PO Complete Prep',
    instructor: 'Suresh Bansal',
    instructorRole: 'Ex-SBI PO | 10 yrs exp',
    rating: 4.7,
    reviews: 980,
    students: '5.1K',
    duration: '60h',
    lessons: 160,
    level: 'Intermediate',
    price: 3499,
    orig: 6999,
    img: 'https://images.unsplash.com/photo-1434626881859-194d67b2b86f?w=900&q=90',
    tag: 'HOT',
    about:
      'Complete prep for IBPS PO, SBI PO, and RRB PO. Covers Quantitative Aptitude, Reasoning, English, and General Awareness with 2000+ practice questions.',
    skills: [
      'Quantitative Aptitude',
      'Logical Reasoning',
      'English Language',
      'General Awareness',
      'Computer Knowledge',
      'Banking GK',
    ],
  },
};

const CURRICULUM = [
  {
    section: 'Section 1: Foundation',
    lessons: [
      { title: 'Welcome & Course Roadmap', dur: '8 min', free: true },
      { title: 'Setting Up Your Environment', dur: '15 min', free: true },
      { title: 'Time & Space Complexity', dur: '22 min', free: false },
    ],
  },
  {
    section: 'Section 2: Arrays & Strings',
    lessons: [
      { title: 'Array Fundamentals', dur: '18 min', free: false },
      { title: 'Two Pointer Technique', dur: '25 min', free: false },
      { title: 'Sliding Window Problems', dur: '30 min', free: false },
      { title: 'String Manipulation', dur: '20 min', free: false },
    ],
  },
  {
    section: 'Section 3: Trees & Graphs',
    lessons: [
      { title: 'Binary Trees Deep Dive', dur: '35 min', free: false },
      { title: 'Graph BFS & DFS', dur: '28 min', free: false },
      { title: 'Topological Sort', dur: '22 min', free: false },
    ],
  },
  {
    section: 'Section 4: System Design',
    lessons: [
      { title: 'System Design Primer', dur: '40 min', free: false },
      { title: 'Design Instagram', dur: '55 min', free: false },
      { title: 'Design URL Shortener', dur: '45 min', free: false },
    ],
  },
];

const TABS = ['overview', 'curriculum', 'instructor'] as const;
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
}: {
  sec: { section: string; lessons: { title: string; dur: string; free: boolean }[] };
  sIndex: number;
  openSection: number | null;
  setOpenSection: (n: number | null) => void;
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
          {sec.lessons.map((lesson, li) => (
            <View
              key={li}
              style={themeStyle({
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderBottomWidth: li < sec.lessons.length - 1 ? 1 : 0,
                borderBottomColor: '#111118',
              })}
            >
              <View
                style={themeStyle({
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  backgroundColor: lesson.free ? '#1E1B4B' : '#2D2D4E',
                  alignItems: 'center',
                  justifyContent: 'center',
                })}
              >
                {lesson.free ? (
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
                    color: lesson.free ? '#E2E8F0' : '#64748B',
                  })}
                >
                  {lesson.title}
                </Text>
                {lesson.free && (
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
            </View>
          ))}
        </View>
      )}
    </Animated.View>
  );
}

export default function CourseDetail() {
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

  const template = COURSES[id as string] || {
    ...COURSES['1'],
    title: 'Course',
    instructor: 'IAs Academy Faculty',
    instructorRole: 'Expert instructor',
    rating: 0,
    reviews: 0,
    students: 'New',
    tag: 'COURSE',
    about: 'Course details are being prepared.',
  };
  const { data: apiCourse } = useQuery({
    queryKey: ['course', id],
    enabled: Boolean(id),
    retry: false,
    queryFn: async () => {
      const response = await fetch(`/api/courses?id=${encodeURIComponent(String(id))}`);
      if (!response.ok) throw new Error('Failed to load course');
      return response.json();
    },
  });
  const course = apiCourse
    ? {
        ...template,
        title: apiCourse.title,
        instructor: apiCourse.instructor,
        duration: apiCourse.duration,
        lessons: Number(apiCourse.lesson_count) || template.lessons,
        level: apiCourse.level,
        price: Number(apiCourse.price),
        orig: Math.max(Number(apiCourse.price), template.orig),
        img: apiCourse.thumbnail_url || template.img,
        about: apiCourse.description || template.about,
        tag: apiCourse.category_name?.toUpperCase() || template.tag,
      }
    : template;
  const discount = Math.round((1 - course.price / course.orig) * 100);

  const heroFade = useRef(new Animated.Value(0)).current;
  const contentFade = useRef(new Animated.Value(0)).current;
  const contentSlide = useRef(new Animated.Value(30)).current;
  const playPulse = useRef(new Animated.Value(1)).current;
  const ctaSc = useRef(new Animated.Value(1)).current;
  const heartSc = useRef(new Animated.Value(1)).current;
  const tabIndicator = useRef(new Animated.Value(0)).current;
  const submitSc = useRef(new Animated.Value(1)).current;

  useEffect(() => {
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
  }, []);

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
      const res = await fetch('/api/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId: id, code: trimmed }),
      });
      const data = await res.json();
      if (res.ok) {
        closeModal();
        setTimeout(() => {
          const msg = data.already_enrolled
            ? `You're already enrolled in ${course.title}!`
            : data.discount_pct > 0
              ? `🎉 ${data.discount_pct}% discount applied! You're enrolled in ${course.title}.`
              : `🎉 You've successfully enrolled in ${course.title}.`;
          Alert.alert('Enrolled!', msg, [{ text: 'Start Learning', onPress: () => router.back() }]);
        }, 300);
      } else {
        setCodeError(data.error || 'Invalid code. Please try again.');
      }
    } catch {
      setCodeError('Something went wrong. Please try again.');
    } finally {
      setEnrolling(false);
    }
  };

  const tabW = (W - 40 - 8) / 3;
  const indicatorLeft = tabIndicator.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [4, tabW + 4, tabW * 2 + 4],
  });

  return (
    <View style={themeStyle({ flex: 1, backgroundColor: '#0A0A0F' })}>
      <StatusBar style="light" />

      {/* Hero */}
      <Animated.View style={themeStyle({ opacity: heroFade, height: 260, position: 'relative' })}>
        <Image
          source={{ uri: course.img }}
          style={themeStyle({ width: '100%', height: '100%' })}
          contentFit="cover"
        />

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
        <Animated.View
          style={themeStyle({
            position: 'absolute',
            bottom: 20,
            left: W / 2 - 28,
            transform: [{ scale: playPulse }],
          })}
        >
          <TouchableOpacity
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
                ({course.reviews.toLocaleString()})
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
              {CURRICULUM.map((sec, si) => (
                <CurriculumSection
                  key={si}
                  sec={sec}
                  sIndex={si}
                  openSection={openSection}
                  setOpenSection={setOpenSection}
                />
              ))}
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
                    { n: '4.9', l: 'Rating' },
                    { n: '50K+', l: 'Students' },
                    { n: '12', l: 'Courses' },
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
                  A passionate educator with 8+ years of industry experience at top tech companies.
                  Mentored thousands of students who are now at FAANG companies and top Indian
                  startups. Known for making complex concepts simple through real-world projects.
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
            </View>
            <Text style={themeStyle({ fontWeight: '600', fontSize: 11, color: '#10B981' })}>
              {discount}% off · 2 days left!
            </Text>
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
                    color: '#374151',
                    marginBottom: 16,
                    marginLeft: 4,
                  })}
                >
                  Try: WELCOME50 · IASFREE100 · LAUNCH2026
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
