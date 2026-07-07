import React, { useRef, useEffect } from 'react';
import { View, Text, Animated, Pressable } from 'react-native';
import { Star, Clock } from 'lucide-react-native';
import { Image } from 'expo-image';
import { themeStyle } from '@/utils/theme';
import type { Course } from '@/types';

function CourseCard({
  course,
  index,
  onPress,
}: {
  course: Course;
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
                  {course.rating || 'New'}
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
              ₹{Number(course.price ?? 0).toLocaleString('en-IN')}
            </Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default CourseCard;
