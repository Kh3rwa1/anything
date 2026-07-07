import React, { useRef, useEffect } from 'react';
import { Animated } from 'react-native';
import { useAppTheme, themeStyle } from '@/utils/theme';

function PulsingDot() {
  const theme = useAppTheme();
  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.5, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  return (
    <Animated.View
      style={themeStyle({
        transform: [{ scale: pulse }],
        position: 'absolute',
        top: 8,
        right: 8,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#EF4444',
        borderWidth: 1.5,
        borderColor: theme.screen,
      })}
    />
  );
}

export default PulsingDot;
