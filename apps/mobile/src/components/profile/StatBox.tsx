import React, { useRef, useEffect } from 'react';
import { Text, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { themeStyle } from '@/utils/theme';

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

export default StatBox;
