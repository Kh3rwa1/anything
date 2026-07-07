import React, { useRef } from 'react';
import { Text, Animated, Pressable } from 'react-native';
import { themeStyle } from '@/utils/theme';
import { CATEGORIES } from './constants';

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

export default CategoryPill;
