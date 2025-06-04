import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { colors, fontSizes, spacing } from '../theme'

type EmptyStateProps = {
  title: string
  message: string
  icon: React.ComponentProps<typeof Ionicons>['name']
}

export function EmptyState({
  title = 'Nenhuma conta ainda',
  message = 'Comece criando sua primeira conta para gerenciar suas finanças',
  icon = 'wallet-outline',
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={48} color={colors.muted} />
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl * 2,
  },
  iconContainer: {
    padding: spacing.lg,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: fontSizes.lg,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  message: {
    fontSize: fontSizes.md,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
  },
})
