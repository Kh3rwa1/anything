/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Animated,
  Pressable,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  CreditCard,
  Award,
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
  Target,
  Bell,
  Star,
  BookOpen,
  Zap,
  Settings,
  Edit3,
  TrendingUp,
  Sun,
  Moon,
} from 'lucide-react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '@/utils/auth/useAuth';
import { useAppTheme, themeStyle } from '@/utils/theme';

const MENU_SECTIONS = [
  {
    title: 'Account',
    items: [
      { icon: CreditCard, label: 'Subscriptions & Billing', color: '#818CF8', bg: '#1E1B4B' },
      { icon: Award, label: 'My Certificates', color: '#F59E0B', bg: '#2D1A00' },
      { icon: Target, label: 'Target Careers', color: '#10B981', bg: '#022C22' },
      { icon: TrendingUp, label: 'Performance Reports', color: '#0EA5E9', bg: '#0C1A29' },
    ],
  },
  {
    title: 'Preferences',
    items: [
      { icon: Shield, label: 'Security & Privacy', color: '#A78BFA', bg: '#1E0B3A' },
      { icon: Settings, label: 'App Settings', color: '#64748B', bg: '#1A1A2E' },
    ],
  },
  {
    title: 'Support',
    items: [{ icon: HelpCircle, label: 'Help Center', color: '#0EA5E9', bg: '#0C1A29' }],
  },
];

function MenuItem({
  icon: IconComp,
  label,
  color,
  bg,
  index,
}: {
  icon: any;
  label: string;
  color: string;
  bg: string;
  index: number;
}) {
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(20)).current;
  const sc = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 300,
        delay: 100 + index * 45,
        useNativeDriver: true,
      }),
      Animated.spring(slide, {
        toValue: 0,
        tension: 80,
        friction: 10,
        delay: 100 + index * 45,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  return (
    <Animated.View
      style={themeStyle({ opacity: fade, transform: [{ translateX: slide }, { scale: sc }] })}
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
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingVertical: 15,
        })}
      >
        <View style={themeStyle({ flexDirection: 'row', alignItems: 'center', gap: 14 })}>
          <View
            style={themeStyle({
              width: 36,
              height: 36,
              borderRadius: 10,
              backgroundColor: bg,
              alignItems: 'center',
              justifyContent: 'center',
            })}
          >
            <IconComp size={17} color={color} />
          </View>
          <Text style={themeStyle({ fontWeight: '500', fontSize: 15, color: '#E2E8F0' })}>
            {label}
          </Text>
        </View>
        <ChevronRight size={16} color="#2D2D4E" />
      </Pressable>
    </Animated.View>
  );
}

function StatBox({
  val,
  label,
  icon,
  colors,
  delay,
}: {
  val: string;
  label: string;
  icon: React.ReactNode;
  colors: [string, string];
  delay: number;
}) {
  const a = useRef(new Animated.Value(0)).current;
  const sc = useRef(new Animated.Value(0.7)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(a, { toValue: 1, duration: 300, delay, useNativeDriver: true }),
      Animated.spring(sc, { toValue: 1, tension: 120, friction: 8, delay, useNativeDriver: true }),
    ]).start();
  }, []);
  return (
    <Animated.View style={themeStyle({ flex: 1, opacity: a, transform: [{ scale: sc }] })}>
      <LinearGradient
        colors={colors}
        style={themeStyle({
          borderRadius: 16,
          padding: 12,
          alignItems: 'center',
          borderWidth: 1,
          borderColor: '#2D2D4E',
        })}
      >
        {icon}
        <Text
          style={themeStyle({ fontWeight: '800', fontSize: 17, color: '#F1F5F9', marginTop: 5 })}
        >
          {val}
        </Text>
        <Text
          style={themeStyle({ fontWeight: '400', fontSize: 10, color: '#4B5563', marginTop: 1 })}
        >
          {label}
        </Text>
      </LinearGradient>
    </Animated.View>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();
  const [notif, setNotif] = useState(true);
  const { signOut } = useAuth();

  const avatarFade = useRef(new Animated.Value(0)).current;
  const avatarScale = useRef(new Animated.Value(0.5)).current;
  const contentFade = useRef(new Animated.Value(0)).current;
  const contentSlide = useRef(new Animated.Value(30)).current;
  const proAnim = useRef(new Animated.Value(0)).current;
  const logoutSc = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(avatarFade, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.spring(avatarScale, {
          toValue: 1,
          tension: 120,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(contentFade, { toValue: 1, duration: 350, useNativeDriver: true }),
        Animated.spring(contentSlide, {
          toValue: 0,
          tension: 80,
          friction: 10,
          useNativeDriver: true,
        }),
      ]),
      Animated.spring(proAnim, { toValue: 1, tension: 80, friction: 8, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: () => signOut() },
    ]);
  };

  return (
    <View style={themeStyle({ flex: 1, backgroundColor: '#0A0A0F' })}>
      <StatusBar style="light" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 30 }}
      >
        <LinearGradient
          colors={['#1E1B4B', '#0A0A0F']}
          style={themeStyle({
            paddingTop: insets.top + 16,
            paddingBottom: 36,
            alignItems: 'center',
            paddingHorizontal: 20,
          })}
        >
          <Animated.View
            style={themeStyle({
              opacity: avatarFade,
              transform: [{ scale: avatarScale }],
              position: 'relative',
              marginBottom: 16,
            })}
          >
            <View
              style={themeStyle({
                width: 96,
                height: 96,
                borderRadius: 48,
                borderWidth: 3,
                borderColor: '#F59E0B',
                overflow: 'hidden',
              })}
            >
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&q=80',
                }}
                style={themeStyle({ width: '100%', height: '100%' })}
                contentFit="cover"
              />
            </View>
            <LinearGradient
              colors={['#4F46E5', '#7C3AED']}
              style={themeStyle({
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: 30,
                height: 30,
                borderRadius: 15,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 2,
                borderColor: '#0A0A0F',
              })}
            >
              <Edit3 size={13} color="#FFFFFF" />
            </LinearGradient>
          </Animated.View>
          <Animated.View
            style={themeStyle({
              alignItems: 'center',
              opacity: contentFade,
              transform: [{ translateY: contentSlide }],
            })}
          >
            <Text
              style={themeStyle({
                fontWeight: '800',
                fontSize: 24,
                color: '#FFFFFF',
                marginBottom: 4,
              })}
            >
              Rahul Sharma
            </Text>
            <Text
              style={themeStyle({
                fontWeight: '400',
                fontSize: 13,
                color: '#6366F1',
                marginBottom: 14,
              })}
            >
              rahul.s@example.com
            </Text>
            <LinearGradient
              colors={['#F59E0B', '#EF4444']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={themeStyle({
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
                borderRadius: 99,
                paddingHorizontal: 16,
                paddingVertical: 7,
                marginBottom: 16,
              })}
            >
              <Star size={12} color="#FFFFFF" fill="#FFFFFF" />
              <Text style={themeStyle({ fontWeight: '800', fontSize: 12, color: '#FFFFFF' })}>
                Elite Prepster — Level 7
              </Text>
            </LinearGradient>
            <View style={themeStyle({ flexDirection: 'row', gap: 8 })}>
              {['💻 SDE Track', '🔥 7-Day Streak'].map((t, i) => (
                <View
                  key={i}
                  style={themeStyle({
                    backgroundColor: '#111118',
                    borderRadius: 99,
                    paddingHorizontal: 14,
                    paddingVertical: 6,
                    borderWidth: 1,
                    borderColor: '#2D2D4E',
                  })}
                >
                  <Text style={themeStyle({ fontWeight: '600', fontSize: 12, color: '#818CF8' })}>
                    {t}
                  </Text>
                </View>
              ))}
            </View>
          </Animated.View>
        </LinearGradient>

        {/* Stats — use StatBox components instead of .map() with hooks */}
        <View
          style={themeStyle({
            flexDirection: 'row',
            marginHorizontal: 20,
            marginTop: -16,
            gap: 10,
            marginBottom: 24,
          })}
        >
          <StatBox
            val="8"
            label="Courses"
            icon={<BookOpen size={14} color="#818CF8" />}
            colors={['#1E1B4B', '#252560']}
            delay={300}
          />

          <StatBox
            val="3"
            label="Certs"
            icon={<Award size={14} color="#F59E0B" />}
            colors={['#2D1A00', '#3D2600']}
            delay={370}
          />

          <StatBox
            val="480"
            label="XP"
            icon={<Zap size={14} color="#10B981" />}
            colors={['#022C22', '#033828']}
            delay={440}
          />

          <StatBox
            val="#42"
            label="Rank"
            icon={<TrendingUp size={14} color="#EF4444" />}
            colors={['#2D0A0A', '#3D1010']}
            delay={510}
          />
        </View>

        {/* Pro Card */}
        <Animated.View
          style={themeStyle({
            paddingHorizontal: 20,
            marginBottom: 28,
            opacity: proAnim,
            transform: [{ scale: proAnim }],
          })}
        >
          <LinearGradient
            colors={['#4F46E5', '#7C3AED']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={themeStyle({ borderRadius: 22, padding: 20 })}
          >
            <View
              style={themeStyle({
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              })}
            >
              <View>
                <Text
                  style={themeStyle({
                    fontWeight: '400',
                    fontSize: 11,
                    color: '#C4B5FD',
                    marginBottom: 2,
                  })}
                >
                  Current Plan
                </Text>
                <Text
                  style={themeStyle({
                    fontWeight: '800',
                    fontSize: 20,
                    color: '#FFFFFF',
                    marginBottom: 2,
                  })}
                >
                  IAs Academy Pro ✦
                </Text>
                <Text style={themeStyle({ fontWeight: '400', fontSize: 11, color: '#A5B4FC' })}>
                  Renews Aug 1, 2026
                </Text>
              </View>
              <TouchableOpacity
                style={themeStyle({
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  borderRadius: 12,
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.2)',
                })}
              >
                <Text style={themeStyle({ fontWeight: '700', fontSize: 12, color: '#FFFFFF' })}>
                  Manage
                </Text>
              </TouchableOpacity>
            </View>
            <View style={themeStyle({ marginTop: 16 })}>
              <View
                style={themeStyle({
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 6,
                })}
              >
                <Text style={themeStyle({ fontWeight: '500', fontSize: 11, color: '#C4B5FD' })}>
                  Subscription period
                </Text>
                <Text style={themeStyle({ fontWeight: '600', fontSize: 11, color: '#FFFFFF' })}>
                  68% remaining
                </Text>
              </View>
              <View
                style={themeStyle({
                  height: 6,
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  borderRadius: 3,
                  overflow: 'hidden',
                })}
              >
                <View
                  style={themeStyle({
                    width: '68%',
                    height: '100%',
                    backgroundColor: '#FFFFFF',
                    borderRadius: 3,
                  })}
                />
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Menu */}
        <View style={themeStyle({ paddingHorizontal: 20 })}>
          {MENU_SECTIONS.map((section, si) => (
            <View key={si} style={themeStyle({ marginBottom: 20 })}>
              <Text
                style={themeStyle({
                  fontWeight: '600',
                  fontSize: 10,
                  color: '#374151',
                  letterSpacing: 1.5,
                  textTransform: 'uppercase',
                  marginBottom: 10,
                })}
              >
                {section.title}
              </Text>
              <View
                style={themeStyle({
                  backgroundColor: '#1A1A2E',
                  borderRadius: 20,
                  overflow: 'hidden',
                  borderWidth: 1,
                  borderColor: '#2D2D4E',
                })}
              >
                {section.items.map((item, ii) => (
                  <View key={ii}>
                    <MenuItem
                      icon={item.icon}
                      label={item.label}
                      color={item.color}
                      bg={item.bg}
                      index={si * 10 + ii}
                    />

                    {ii < section.items.length - 1 && (
                      <View
                        style={themeStyle({
                          height: 1,
                          backgroundColor: '#111118',
                          marginLeft: 66,
                        })}
                      />
                    )}
                  </View>
                ))}
              </View>
            </View>
          ))}

          {/* Notifications Toggle */}
          <View
            style={themeStyle({
              backgroundColor: '#1A1A2E',
              borderRadius: 20,
              overflow: 'hidden',
              borderWidth: 1,
              borderColor: '#2D2D4E',
              marginBottom: 20,
            })}
          >
            <View
              style={themeStyle({
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 16,
                paddingVertical: 15,
              })}
            >
              <View style={themeStyle({ flexDirection: 'row', alignItems: 'center', gap: 14 })}>
                <View
                  style={themeStyle({
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    backgroundColor: '#1E1B4B',
                    alignItems: 'center',
                    justifyContent: 'center',
                  })}
                >
                  <Bell size={17} color="#818CF8" />
                </View>
                <Text style={themeStyle({ fontWeight: '500', fontSize: 15, color: '#E2E8F0' })}>
                  Push Notifications
                </Text>
              </View>
              <Switch
                value={notif}
                onValueChange={setNotif}
                trackColor={{ false: '#2D2D4E', true: '#4F46E5' }}
                thumbColor="#FFFFFF"
              />
            </View>
            <View style={themeStyle({ height: 1, backgroundColor: '#111118', marginLeft: 66 })} />
            <View
              style={themeStyle({
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 16,
                paddingVertical: 15,
              })}
            >
              <View style={themeStyle({ flexDirection: 'row', alignItems: 'center', gap: 14 })}>
                <View
                  style={themeStyle({
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    backgroundColor: theme.isLight ? '#FFF7ED' : '#1E1B4B',
                    alignItems: 'center',
                    justifyContent: 'center',
                  })}
                >
                  {theme.isLight ? (
                    <Sun size={17} color="#F59E0B" />
                  ) : (
                    <Moon size={17} color="#818CF8" />
                  )}
                </View>
                <View>
                  <Text style={themeStyle({ fontWeight: '500', fontSize: 15, color: '#E2E8F0' })}>
                    Day Mode
                  </Text>
                  <Text
                    style={themeStyle({
                      fontWeight: '400',
                      fontSize: 11,
                      color: '#4B5563',
                      marginTop: 2,
                    })}
                  >
                    {theme.isLight ? 'Bright interface enabled' : 'Switch to a bright interface'}
                  </Text>
                </View>
              </View>
              <Switch
                value={theme.isLight}
                onValueChange={(enabled) => theme.setMode(enabled ? 'light' : 'dark')}
                trackColor={{ false: '#2D2D4E', true: '#F59E0B' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          {/* Sign Out */}
          <Pressable
            onPressIn={() =>
              Animated.spring(logoutSc, {
                toValue: 0.95,
                useNativeDriver: true,
                tension: 400,
              }).start()
            }
            onPressOut={() =>
              Animated.spring(logoutSc, { toValue: 1, useNativeDriver: true, tension: 400 }).start()
            }
            onPress={handleSignOut}
          >
            <Animated.View
              style={themeStyle({
                transform: [{ scale: logoutSc }],
                flexDirection: 'row',
                alignItems: 'center',
                gap: 14,
                backgroundColor: '#1A0A0A',
                borderRadius: 20,
                padding: 16,
                borderWidth: 1,
                borderColor: '#3D1010',
                marginBottom: 8,
              })}
            >
              <View
                style={themeStyle({
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  backgroundColor: '#2D0A0A',
                  alignItems: 'center',
                  justifyContent: 'center',
                })}
              >
                <LogOut size={17} color="#EF4444" />
              </View>
              <Text
                style={themeStyle({ fontWeight: '600', fontSize: 15, color: '#EF4444', flex: 1 })}
              >
                Sign Out
              </Text>
            </Animated.View>
          </Pressable>

          <Text
            style={themeStyle({
              textAlign: 'center',
              fontWeight: '400',
              fontSize: 12,
              color: '#1E1E2E',
              marginTop: 20,
            })}
          >
            IAs Academy v1.0.0 · Made with ❤️ in India 🇮🇳
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
