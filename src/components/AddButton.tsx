import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { colors, fontSizes, spacing } from '../theme'

type AddButtonProps = {
  onPress: () => void
  title?: string
  icon?: React.ComponentProps<typeof Ionicons>['name']
}

export function AddButton({
  onPress,
  title = 'Nova Conta',
  icon = 'add-circle-outline',
}: AddButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={styles.container}
    >
      <LinearGradient
        colors={[colors.primary, '#3b82f6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        <Ionicons name={icon} size={24} color="white" />
        <Text style={styles.text}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 15,
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md + 2,
    borderRadius: 16,
    gap: spacing.sm,
  },
  text: {
    fontSize: fontSizes.lg,
    fontWeight: '700',
    color: 'white',
    letterSpacing: 0.5,
  },
})
