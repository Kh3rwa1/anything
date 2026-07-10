import React, { useRef, useEffect } from 'react';
import { Text, Animated } from 'react-native';
import { themeStyle } from '@/utils/theme';

function StatPill({
  n,
  label,
  color,
  delay,
}: {
  n: string;
  label: string;
  color: string;
  delay: number;
}) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(anim, {
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
        flex: 1,
        backgroundColor: '#1A1A2E',
        borderRadius: 16,
        paddingVertical: 14,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: `${color}35`,
        shadowColor: color,
        shadowOpacity: 0.13,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 5 },
        elevation: 3,
        opacity: anim,
        transform: [{ scale: anim }],
      })}
    >
      <Text style={themeStyle({ fontWeight: '800', fontSize: 20, color })}>{n}</Text>
      <Text style={themeStyle({ fontWeight: '500', fontSize: 11, color: '#4B5563', marginTop: 2 })}>
        {label}
      </Text>
    </Animated.View>
  );
}

export default StatPill;
