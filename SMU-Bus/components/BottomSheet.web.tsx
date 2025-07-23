import React, { ReactNode, useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { AppColors, BorderRadius, Shadow, Spacing } from '@/constants/Colors';

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
  const [currentIndex, setCurrentIndex] = useState(initialSnapIndex);

  const handleToggle = () => {
    const nextIndex = currentIndex === 0 ? 2 : currentIndex - 1;
    setCurrentIndex(nextIndex);
    if (onSnapPointChange) {
      onSnapPointChange(nextIndex);
    }
  };

  const containerStyle = {
    transform: [{ translateY: snapPoints[currentIndex] }],
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity style={styles.handleContainer} onPress={handleToggle}>
        <View style={styles.handle} />
      </TouchableOpacity>
      <View style={styles.content}>
        {children}
      </View>
    </View>
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