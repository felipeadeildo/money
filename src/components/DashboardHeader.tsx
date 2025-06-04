import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { colors, fontSizes, spacing } from '../theme'

type DashboardHeaderProps = {
  totalTransactions: number
}

export function DashboardHeader({ totalTransactions }: DashboardHeaderProps) {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>
          {totalTransactions}{' '}
          {totalTransactions === 1 ? 'transação' : 'transações'}
        </Text>
      </View>

      <View style={styles.iconContainer}>
        <Ionicons name="analytics-outline" size={24} color={colors.primary} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    fontSize: fontSizes.xl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs / 2,
  },
  subtitle: {
    fontSize: fontSizes.sm,
    color: colors.muted,
    fontWeight: '500',
  },
  iconContainer: {
    padding: spacing.sm,
    borderRadius: 12,
    backgroundColor: `${colors.primary}15`,
    borderWidth: 1,
    borderColor: `${colors.primary}30`,
  },
})
