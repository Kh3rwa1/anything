import React, { useRef, useEffect } from 'react';
import { View, Text, Animated, Pressable } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { themeStyle } from '@/utils/theme';
import type { LucideIcon } from 'lucide-react-native';

function MenuItem({
  icon: IconComp,
  label,
  color,
  bg,
  index,
  onPress,
}: {
  icon: LucideIcon;
  label: string;
  color: string;
  bg: string;
  index: number;
  onPress: () => void;
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
        onPress={onPress}
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

export default MenuItem;
