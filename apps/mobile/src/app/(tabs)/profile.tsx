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
import { useRouter } from 'expo-router';
import {
  LogOut,
  Bell,
  BookOpen,
  Award,
  Edit3,
  Sun,
  Moon,
} from 'lucide-react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import Constants from 'expo-constants';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/utils/auth/useAuth';
import { useAppTheme, themeStyle } from '@/utils/theme';
import { api } from '@/utils/api';
import type { Enrollment } from '@/types';
import { MENU_SECTIONS, MenuItem, StatBox } from '@/components/profile';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();
  const router = useRouter();
  const [notif] = useState(true);
  const { signOut, auth, isAuthenticated, signIn } = useAuth();

  const { data: enrollments = [] } = useQuery<Enrollment[]>({
    queryKey: ['my-enrollments'],
    queryFn: () => api('/api/enroll'),
    enabled: !!isAuthenticated,
  });

  const name = auth?.user?.name || 'Guest User';
  const email = auth?.user?.email || 'Sign in to sync your progress';
  const avatar = auth?.user?.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80';

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

  const [deleting, setDeleting] = useState(false);

  const handleDeleteAccount = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert(
      'Delete Account',
      'Are you sure you want to permanently delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Permanently',
          style: 'destructive',
          onPress: async () => {
            setDeleting(true);
            try {
              const res = await api('/api/auth/delete-account', { method: 'POST' });
              if (res.success) {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                signOut();
                Alert.alert('Success', 'Your account has been deleted.');
              } else {
                Alert.alert('Error', res.error || 'Failed to delete account.');
              }
            } catch (err) {
              Alert.alert('Error', 'An error occurred while deleting your account.');
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  const handleSignOut = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Sign Out', 
        style: 'destructive', 
        onPress: () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          signOut();
        } 
      },
    ]);
  };

  return (
    <View style={themeStyle({ flex: 1, backgroundColor: '#0A0A0F' })}>
      <StatusBar style={theme.statusBar} />
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
                  uri: avatar,
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
              {name}
            </Text>
            <Text
              style={themeStyle({
                fontWeight: '400',
                fontSize: 13,
                color: '#6366F1',
                marginBottom: 14,
              })}
            >
              {email}
            </Text>
            <LinearGradient
              colors={['#4F46E5', '#7C3AED']}
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
              <Text style={themeStyle({ fontWeight: '800', fontSize: 12, color: '#FFFFFF' })}>
                {isAuthenticated ? 'Student Account' : 'Guest Mode'}
              </Text>
            </LinearGradient>
          </Animated.View>
        </LinearGradient>

        {/* Stats */}
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
            val={String(enrollments?.length || 0)}
            label="Courses"
            icon={<BookOpen size={14} color="#818CF8" />}
            colors={['#1E1B4B', '#252560']}
            delay={300}
          />

          <StatBox
            val="0"
            label="Certificates"
            icon={<Award size={14} color="#F59E0B" />}
            colors={['#2D1A00', '#3D2600']}
            delay={370}
          />
        </View>

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
                      onPress={() => {
                        if (item.label === 'Performance Reports') {
                          router.push('/profile/performance' as any);
                          return;
                        }
                        const messages: Record<string, string> = {
                          'Subscriptions & Billing': 'Manage subscriptions through your App Store or Play Store account settings.',
                          'My Certificates': 'Complete enrolled courses to earn certificates. Keep learning!',
                          'Target Careers': 'Career roadmap matching is coming in a future update. Stay tuned!',
                          'Security & Privacy': 'Your account is secured via Appwrite authentication. Additional security settings coming soon.',
                          'App Settings': 'Additional app settings are coming in a future update.',
                          'Help Center': 'Need help? Contact us at support@ias-academy.in',
                        };
                        Alert.alert(item.label, messages[item.label] || 'This feature is coming in a future update.');
                      }}
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
              onValueChange={() => {
                Haptics.selectionAsync();
                Alert.alert('Push Notifications', 'Push notification configuration is coming in a future update!');
              }}
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
                onValueChange={(enabled) => {
                  theme.setMode(enabled ? 'light' : 'dark');
                  Haptics.selectionAsync();
                }}
                trackColor={{ false: '#2D2D4E', true: '#F59E0B' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
 
          {/* Sign Out / Sign In */}
          {isAuthenticated ? (
            <View style={themeStyle({ gap: 8 })}>
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

              <Pressable
                disabled={deleting}
                onPress={handleDeleteAccount}
                style={({ pressed }) =>
                  themeStyle({
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 14,
                    backgroundColor: pressed ? '#220404' : '#140202',
                    borderRadius: 20,
                    padding: 16,
                    borderWidth: 1,
                    borderColor: '#2D0A0A',
                    opacity: deleting ? 0.7 : 1,
                  })
                }
              >
                <View
                  style={themeStyle({
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    backgroundColor: '#220404',
                    alignItems: 'center',
                    justifyContent: 'center',
                  })}
                >
                  <LogOut size={17} color="#EF4444" style={{ transform: [{ rotate: '90deg' }] }} />
                </View>
                <Text
                  style={themeStyle({ fontWeight: '600', fontSize: 15, color: '#EF4444', flex: 1 })}
                >
                  {deleting ? 'Deleting Account...' : 'Delete Account'}
                </Text>
              </Pressable>
            </View>
          ) : (
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
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                signIn();
              }}
            >
              <Animated.View
                style={themeStyle({
                  transform: [{ scale: logoutSc }],
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 14,
                  backgroundColor: '#0F172A',
                  borderRadius: 20,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: '#1E293B',
                  marginBottom: 8,
                })}
              >
                <View
                  style={themeStyle({
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    backgroundColor: '#1E293B',
                    alignItems: 'center',
                    justifyContent: 'center',
                  })}
                >
                  <LogOut size={17} color="#38BDF8" style={{ transform: [{ rotate: '180deg' }] }} />
                </View>
                <Text
                  style={themeStyle({ fontWeight: '600', fontSize: 15, color: '#38BDF8', flex: 1 })}
                >
                  Sign In / Sign Up
                </Text>
              </Animated.View>
            </Pressable>
          )}
 
          <Text
            style={themeStyle({
              textAlign: 'center',
              fontWeight: '400',
              fontSize: 12,
              color: '#1E1E2E',
              marginTop: 20,
            })}
          >
            IAs Academy v{Constants.expoConfig?.version ?? '1.0.0'} · Made with ❤️ in India 🇮🇳
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
