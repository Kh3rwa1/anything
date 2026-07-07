import React, { useRef, useEffect } from 'react';
import { Animated } from 'react-native';
import { themeStyle } from '@/utils/theme';

function AnimatedDot({ active }: { active: boolean }) {
  const width = useRef(new Animated.Value(active ? 20 : 6)).current;
  useEffect(() => {
    Animated.spring(width, {
      toValue: active ? 20 : 6,
      useNativeDriver: false,
      tension: 200,
    }).start();
  }, [active]);
  return (
    <Animated.View
      style={themeStyle({
        width,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#4F46E5',
        opacity: active ? 1 : 0.35,
      })}
    />
  );
}

export default AnimatedDot;
