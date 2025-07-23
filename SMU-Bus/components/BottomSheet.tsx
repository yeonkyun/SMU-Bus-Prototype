import React, { ReactNode } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { AppColors, BorderRadius, Shadow } from '@/constants/Colors';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface BottomSheetProps {
  children: ReactNode;
  snapPoints: number[];
  initialSnapIndex?: number;
  onSnapPointChange?: (index: number) => void;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  children,
  snapPoints,
  initialSnapIndex = 0,
  onSnapPointChange,
}) => {
  const translateY = useSharedValue(snapPoints[initialSnapIndex]);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context: any) => {
      context.startY = translateY.value;
    },
    onActive: (event, context: any) => {
      const newTranslateY = context.startY + event.translationY;
      const velocity = event.velocityY;
      
      // 제한된 범위 내에서만 드래그 허용
      const constrainedY = Math.max(
        snapPoints[snapPoints.length - 1],
        Math.min(snapPoints[0], newTranslateY)
      );
      
      // 적당히 빠르게 움직이면 즉시 snap (드래그 중에!)
      if (Math.abs(velocity) > 100) {
        // 현재 가장 가까운 snap point 찾기
        let closestIndex = 0;
        let minDistance = Math.abs(constrainedY - snapPoints[0]);
        
        for (let i = 1; i < snapPoints.length; i++) {
          const distance = Math.abs(constrainedY - snapPoints[i]);
          if (distance < minDistance) {
            minDistance = distance;
            closestIndex = i;
          }
        }
        
        // 방향에 따라 즉시 snap
        if (velocity > 500 && closestIndex > 0) {
          // 아래로 빠르게 움직이면 위쪽 snap으로 (더 작은 translateY)
          translateY.value = withSpring(snapPoints[closestIndex - 1], {
            damping: 20,
            stiffness: 200,
            mass: 0.8,
          });
          if (onSnapPointChange) {
            runOnJS(onSnapPointChange)(closestIndex - 1);
          }
          return;
        } else if (velocity < -500 && closestIndex < snapPoints.length - 1) {
          // 위로 빠르게 움직이면 아래쪽 snap으로 (더 큰 translateY)
          translateY.value = withSpring(snapPoints[closestIndex + 1], {
            damping: 20,
            stiffness: 200,
            mass: 0.8,
          });
          if (onSnapPointChange) {
            runOnJS(onSnapPointChange)(closestIndex + 1);
          }
          return;
        }
      }
      
      translateY.value = constrainedY;
    },
    onEnd: (event) => {
      const velocity = event.velocityY;
      const currentPosition = translateY.value;
      let targetSnapPoint = snapPoints[0];
      let closestIndex = 0;

      // 현재 가장 가까운 snap point 찾기
      let minDistance = Math.abs(currentPosition - snapPoints[0]);
      for (let i = 1; i < snapPoints.length; i++) {
        const distance = Math.abs(currentPosition - snapPoints[i]);
        if (distance < minDistance) {
          minDistance = distance;
          targetSnapPoint = snapPoints[i];
          closestIndex = i;
        }
      }

      // 적당한 움직임으로 snap (튕기는 듯한 느낌)
      // 방향성 체크 - velocity가 적당히 있으면 그 방향으로 snap
      if (velocity > 500 && closestIndex > 0) {
        // 아래로 적당히 움직이면 위쪽 snap으로
        targetSnapPoint = snapPoints[closestIndex - 1];
        closestIndex = closestIndex - 1;
      } else if (velocity < -500 && closestIndex < snapPoints.length - 1) {
        // 위로 적당히 움직이면 아래쪽 snap으로
        targetSnapPoint = snapPoints[closestIndex + 1];
        closestIndex = closestIndex + 1;
      }
      // 움직임이 거의 없으면 가장 가까운 곳으로 자동 snap

      translateY.value = withSpring(targetSnapPoint, {
        damping: 20,
        stiffness: 200,
        mass: 0.8,
      });

      if (onSnapPointChange) {
        runOnJS(onSnapPointChange)(closestIndex);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <>
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.container, animatedStyle]}>
          <View style={styles.handleContainer}>
            <View style={styles.handle} />
          </View>
          <View style={styles.content}>
            {children}
          </View>
        </Animated.View>
      </PanGestureHandler>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT,
    backgroundColor: AppColors.surface,
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
    zIndex: 2,
    ...Shadow.lg,
  },
  handleContainer: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: AppColors.text.tertiary,
    borderRadius: 2,
  },
  content: {
    flex: 1,
  },
});