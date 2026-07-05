/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, Animated, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, CheckCheck } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { themeStyle } from '@/utils/theme';

const NOTIFICATIONS = [
  {
    id: 1,
    icon: '🔥',
    title: '7-Day Streak!',
    body: "Amazing! You've maintained a 7-day learning streak. Keep it up!",
    time: '2m ago',
    unread: true,
    bg: '#2D1A00',
  },
  {
    id: 2,
    icon: '📚',
    title: 'New lesson available',
    body: '"System Design: Design WhatsApp" has been added to your SDE BootCamp.',
    time: '1h ago',
    unread: true,
    bg: '#1E1B4B',
  },
  {
    id: 3,
    icon: '🏆',
    title: 'Badge Unlocked!',
    body: 'You earned the "Fast Learner" badge for completing 3 lessons in one day!',
    time: '3h ago',
    unread: true,
    bg: '#022C22',
  },
  {
    id: 4,
    icon: '⚡',
    title: 'Flash Sale — 70% OFF',
    body: 'IAs Academy Pro is 70% off for the next 24 hours. Grab it now!',
    time: '5h ago',
    unread: false,
    bg: '#2D0A0A',
  },
  {
    id: 5,
    icon: '🎯',
    title: 'Daily goal reminder',
    body: "You're 30 minutes away from hitting your daily learning goal of 1 hour!",
    time: 'Yesterday',
    unread: false,
    bg: '#0C1A29',
  },
  {
    id: 6,
    icon: '⭐',
    title: 'Rate your experience',
    body: 'How was your session with "Two Pointer Technique"? Leave a quick review!',
    time: 'Yesterday',
    unread: false,
    bg: '#2D1A00',
  },
  {
    id: 7,
    icon: '📈',
    title: 'Weekly report ready',
    body: 'You learned 4.5 hours this week — up 22% from last week. Great progress!',
    time: '2 days ago',
    unread: false,
    bg: '#022C22',
  },
  {
    id: 8,
    icon: '💎',
    title: 'Leaderboard update',
    body: "You jumped to #42 on this week's national leaderboard! Top 5% of students.",
    time: '3 days ago',
    unread: false,
    bg: '#1E0B3A',
  },
];

function NotifCard({
  notif,
  index,
  showUnread,
}: {
  notif: {
    id: number;
    icon: string;
    title: string;
    body: string;
    time: string;
    unread: boolean;
    bg: string;
  };
  index: number;
  showUnread: boolean;
}) {
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(30)).current;
  const sc = useRef(new Animated.Value(1)).current;
  const dot = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 350,
        delay: index * 55,
        useNativeDriver: true,
      }),
      Animated.spring(slide, {
        toValue: 0,
        tension: 80,
        friction: 10,
        delay: index * 55,
        useNativeDriver: true,
      }),
    ]).start();
    if (notif.unread && showUnread) {
      Animated.spring(dot, {
        toValue: 1,
        tension: 200,
        friction: 8,
        delay: index * 55 + 200,
        useNativeDriver: true,
      }).start();
    }
  }, []);

  const isUnread = notif.unread && showUnread;

  return (
    <Animated.View
      style={themeStyle({
        opacity: fade,
        transform: [{ translateY: slide }, { scale: sc }],
        marginBottom: 10,
      })}
    >
      <Pressable
        onPressIn={() =>
          Animated.spring(sc, { toValue: 0.97, useNativeDriver: true, tension: 400 }).start()
        }
        onPressOut={() =>
          Animated.spring(sc, { toValue: 1, useNativeDriver: true, tension: 400 }).start()
        }
        style={themeStyle({
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: 14,
          backgroundColor: isUnread ? '#1A1A2E' : '#111118',
          borderRadius: 18,
          padding: 16,
          borderWidth: 1,
          borderColor: isUnread ? '#2D2D4E' : '#1A1A2E',
        })}
      >
        <View
          style={themeStyle({
            width: 44,
            height: 44,
            borderRadius: 14,
            backgroundColor: notif.bg,
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            opacity: isUnread ? 1 : 0.55,
          })}
        >
          <Text style={themeStyle({ fontSize: 22 })}>{notif.icon}</Text>
        </View>
        <View style={themeStyle({ flex: 1 })}>
          <View
            style={themeStyle({
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 4,
            })}
          >
            <Text
              style={themeStyle({
                fontWeight: '700',
                fontSize: 14,
                color: isUnread ? '#F1F5F9' : '#64748B',
                flex: 1,
                marginRight: 8,
              })}
            >
              {notif.title}
            </Text>
            {isUnread && (
              <Animated.View
                style={themeStyle({
                  transform: [{ scale: dot }],
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: '#4F46E5',
                  flexShrink: 0,
                })}
              />
            )}
          </View>
          <Text
            style={themeStyle({
              fontWeight: '400',
              fontSize: 13,
              color: isUnread ? '#4B5563' : '#374151',
              lineHeight: 18,
            })}
          >
            {notif.body}
          </Text>
          <Text
            style={themeStyle({
              fontWeight: '500',
              fontSize: 11,
              color: isUnread ? '#374151' : '#1F2937',
              marginTop: 6,
            })}
          >
            {notif.time}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [markedRead, setMarkedRead] = useState(false);
  const headerFade = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(-20)).current;
  const backSc = useRef(new Animated.Value(1)).current;
  const checkSc = useRef(new Animated.Value(1)).current;

  const unreadCount = markedRead ? 0 : NOTIFICATIONS.filter((n) => n.unread).length;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerFade, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(headerSlide, {
        toValue: 0,
        tension: 80,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const markAllRead = () => {
    Animated.sequence([
      Animated.spring(checkSc, { toValue: 1.3, tension: 400, friction: 6, useNativeDriver: true }),
      Animated.spring(checkSc, { toValue: 1, tension: 400, friction: 6, useNativeDriver: true }),
    ]).start();
    setMarkedRead(true);
  };

  return (
    <View style={themeStyle({ flex: 1, backgroundColor: '#0A0A0F' })}>
      <StatusBar style="light" />
      <Animated.View
        style={themeStyle({ opacity: headerFade, transform: [{ translateY: headerSlide }] })}
      >
        <LinearGradient
          colors={['#1E1B4B', '#0A0A0F']}
          style={themeStyle({
            paddingTop: insets.top + 8,
            paddingBottom: 20,
            paddingHorizontal: 20,
          })}
        >
          <View
            style={themeStyle({
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            })}
          >
            <View style={themeStyle({ flexDirection: 'row', alignItems: 'center', gap: 12 })}>
              <Pressable
                onPressIn={() =>
                  Animated.spring(backSc, {
                    toValue: 0.85,
                    useNativeDriver: true,
                    tension: 400,
                  }).start()
                }
                onPressOut={() =>
                  Animated.spring(backSc, {
                    toValue: 1,
                    useNativeDriver: true,
                    tension: 400,
                  }).start()
                }
                onPress={() => router.back()}
              >
                <Animated.View
                  style={themeStyle({
                    transform: [{ scale: backSc }],
                    width: 38,
                    height: 38,
                    borderRadius: 19,
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 1,
                    borderColor: '#2D2D4E',
                  })}
                >
                  <ArrowLeft size={18} color="#FFFFFF" />
                </Animated.View>
              </Pressable>
              <View>
                <Text style={themeStyle({ fontWeight: '800', fontSize: 22, color: '#FFFFFF' })}>
                  Notifications
                </Text>
                {unreadCount > 0 && (
                  <Text
                    style={themeStyle({
                      fontWeight: '400',
                      fontSize: 12,
                      color: '#6366F1',
                      marginTop: 1,
                    })}
                  >
                    {unreadCount} unread
                  </Text>
                )}
              </View>
            </View>
            {unreadCount > 0 && (
              <Pressable
                onPressIn={() =>
                  Animated.spring(checkSc, {
                    toValue: 0.92,
                    useNativeDriver: true,
                    tension: 400,
                  }).start()
                }
                onPressOut={() =>
                  Animated.spring(checkSc, {
                    toValue: 1,
                    useNativeDriver: true,
                    tension: 400,
                  }).start()
                }
                onPress={markAllRead}
              >
                <Animated.View
                  style={themeStyle({
                    transform: [{ scale: checkSc }],
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 5,
                    backgroundColor: '#1A1A2E',
                    borderRadius: 99,
                    paddingHorizontal: 12,
                    paddingVertical: 7,
                    borderWidth: 1,
                    borderColor: '#2D2D4E',
                  })}
                >
                  <CheckCheck size={14} color="#818CF8" />
                  <Text style={themeStyle({ fontWeight: '600', fontSize: 12, color: '#818CF8' })}>
                    Mark all read
                  </Text>
                </Animated.View>
              </Pressable>
            )}
          </View>
        </LinearGradient>
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 8,
          paddingBottom: insets.bottom + 24,
        }}
      >
        <Text
          style={themeStyle({
            fontWeight: '700',
            fontSize: 12,
            color: '#374151',
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: 12,
          })}
        >
          Today
        </Text>
        {NOTIFICATIONS.slice(0, 4).map((n, i) => (
          <NotifCard key={n.id} notif={n} index={i} showUnread={!markedRead} />
        ))}
        <Text
          style={themeStyle({
            fontWeight: '700',
            fontSize: 12,
            color: '#374151',
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: 12,
            marginTop: 10,
          })}
        >
          Earlier
        </Text>
        {NOTIFICATIONS.slice(4).map((n, i) => (
          <NotifCard key={n.id} notif={n} index={i + 4} showUnread={false} />
        ))}
      </ScrollView>
    </View>
  );
}
