import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Platform, StyleSheet, Text, View } from 'react-native'
import { colors, fontSizes, spacing } from '../theme'
import { Account } from '../types/types'

type AccountsHeaderProps = {
  accounts: Account[]
}

export function AccountsHeader({ accounts }: AccountsHeaderProps) {
  const totalBalance = accounts.reduce(
    (sum, account) => sum + account.initialBalance,
    0
  )
  const accountCount = accounts.length

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const isPositiveBalance = totalBalance >= 0

  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <View style={styles.infoSection}>
          <Text style={styles.title}>Minhas Contas</Text>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Ionicons name="wallet-outline" size={16} color={colors.muted} />
              <Text style={styles.statText}>
                {accountCount} {accountCount === 1 ? 'conta' : 'contas'}
              </Text>
            </View>

            <View style={styles.separator} />

            <View style={styles.statItem}>
              <Ionicons
                name={isPositiveBalance ? 'trending-up' : 'trending-down'}
                size={16}
                color={isPositiveBalance ? colors.primary : colors.danger}
              />
              <Text
                style={[
                  styles.statText,
                  { color: isPositiveBalance ? colors.text : colors.danger },
                ]}
              >
                {formatCurrency(totalBalance)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.iconContainer}>
          <Ionicons name="analytics-outline" size={24} color={colors.primary} />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: Platform.OS === 'ios' ? spacing.md : spacing.xl,
    paddingBottom: spacing.lg,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  infoSection: {
    flex: 1,
  },
  title: {
    fontSize: fontSizes.xxl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statText: {
    fontSize: fontSizes.sm,
    color: colors.muted,
    fontWeight: '500',
  },
  separator: {
    width: 1,
    height: 12,
    backgroundColor: colors.border,
    marginHorizontal: spacing.sm,
  },
  iconContainer: {
    padding: spacing.sm,
    borderRadius: 12,
    backgroundColor: `${colors.primary}15`,
    borderWidth: 1,
    borderColor: `${colors.primary}30`,
  }
})
