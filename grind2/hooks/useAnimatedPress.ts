import { useRef, useCallback } from 'react';
import { Animated } from 'react-native';

export function useAnimatedPress(scaleTo = 0.96) {
  const scale = useRef(new Animated.Value(1)).current;

  const animatedStyle = { transform: [{ scale }] };

  const onPressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: scaleTo,
      useNativeDriver: true,
      damping: 15,
      stiffness: 300,
    }).start();
  }, [scaleTo]);

  const onPressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      damping: 15,
      stiffness: 300,
    }).start();
  }, []);

  return { animatedStyle, onPressIn, onPressOut };
}
