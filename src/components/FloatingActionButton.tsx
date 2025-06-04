import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Animated, StyleSheet, TouchableOpacity } from 'react-native'
import { colors, spacing } from '../theme'

type FloatingActionButtonProps = {
  onPress: () => void
}

export function FloatingActionButton({ onPress }: FloatingActionButtonProps) {
  const scaleValue = React.useRef(new Animated.Value(1)).current

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start()
  }

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start()
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale: scaleValue }],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.button}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        <Ionicons name="add" size={28} color={colors.white} />
      </TouchableOpacity>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.xl,
    zIndex: 10,
  },
  button: {
    backgroundColor: colors.primary,
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
})
