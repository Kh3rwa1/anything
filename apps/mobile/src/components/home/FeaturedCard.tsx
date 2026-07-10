import React, { useRef } from 'react';
import { View, Text, Animated, Pressable, useWindowDimensions } from 'react-native';
import { Star, Users, Play } from 'lucide-react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { themeStyle } from '@/utils/theme';
import type { Course } from '@/types';

function FeaturedCard({ item, onPress }: { item: Course; onPress: () => void }) {
  const { width: W } = useWindowDimensions();
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
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.13)',
          shadowColor: '#4F46E5',
          shadowOpacity: 0.28,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 10 },
          elevation: 8,
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
        <LinearGradient
          colors={['rgba(129,140,248,0.24)', 'transparent']}
          style={themeStyle({ position: 'absolute', top: 0, left: 0, right: 0, height: '45%' })}
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
            backgroundColor: 'rgba(255,255,255,0.16)',
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.42)',
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
                ₹{Number(item.price ?? 0).toLocaleString('en-IN')}
              </Text>
            </View>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}

export default FeaturedCard;
