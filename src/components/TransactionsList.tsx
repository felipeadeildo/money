import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { FlatList, StyleSheet, Text, View } from 'react-native'
import { colors, fontSizes, spacing } from '../theme'
import { Account } from '../types/types'

type Transaction = {
  id: string
  amount: number
  date: string
  fromAccountId: string
  description?: string
}

type TransactionsListProps = {
  transactions: Transaction[]
  accounts: Account[]
  loading: boolean
  total: number
  onRefresh: () => void
  onLoadMore: () => void
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  })
}

function formatTime(dateString: string) {
  return new Date(dateString).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

const TransactionItem = ({
  item,
  accounts,
}: {
  item: Transaction
  accounts: Account[]
}) => {
  const account = accounts.find((a) => a.id === item.fromAccountId)
  const isPositive = item.amount >= 0

  return (
    <View style={styles.txRow}>
      <View style={styles.txLeft}>
        <View style={styles.txHeader}>
          <Text
            style={[
              styles.txAmount,
              { color: isPositive ? colors.text : colors.danger },
            ]}
          >
            {formatCurrency(item.amount)}
          </Text>
          <View
            style={[
              styles.txTypeIndicator,
              {
                backgroundColor: isPositive
                  ? '#10b98150'
                  : `${colors.danger}50`,
              },
            ]}
          >
            <Ionicons
              name={isPositive ? 'arrow-up' : 'arrow-down'}
              size={12}
              color={isPositive ? '#10b981' : colors.danger}
            />
          </View>
        </View>

        <Text style={styles.txDesc} numberOfLines={1}>
          {item.description || 'Sem descrição'}
        </Text>
      </View>

      <View style={styles.txRight}>
        <View style={styles.txDateContainer}>
          <Text style={styles.txDate}>{formatDate(item.date)}</Text>
          <Text style={styles.txTime}>{formatTime(item.date)}</Text>
        </View>

        <View style={styles.txAccountContainer}>
          <View style={styles.accountIndicator} />
          <Text style={styles.txAccount} numberOfLines={1}>
            {account?.name || 'Conta removida'}
          </Text>
        </View>
      </View>
    </View>
  )
}

export function TransactionsList({
  transactions,
  accounts,
  loading,
  total,
  onRefresh,
  onLoadMore,
}: TransactionsListProps) {
  const renderTransaction = ({ item }: { item: Transaction }) => (
    <TransactionItem item={item} accounts={accounts} />
  )

  const ListEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="receipt-outline" size={64} color={colors.muted} />
      <Text style={styles.emptyTitle}>Nenhuma transação</Text>
      <Text style={styles.emptyText}>
        As transações aparecerão aqui quando forem criadas
      </Text>
    </View>
  )

  const ListHeaderComponent = () => (
    <View style={styles.listHeader}>
      <Text style={styles.listTitle}>Transações Recentes</Text>
      <Text style={styles.listSubtitle}>
        {transactions.length} de {total} transações
      </Text>
    </View>
  )

  return (
    <FlatList
      data={transactions}
      keyExtractor={(item) => item.id}
      renderItem={renderTransaction}
      refreshing={loading}
      onRefresh={onRefresh}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.2}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContainer}
      ListEmptyComponent={ListEmptyComponent}
      ListHeaderComponent={
        transactions.length > 0 ? ListHeaderComponent : undefined
      }
    />
  )
}

const styles = StyleSheet.create({
  listContainer: {
    padding: spacing.lg,
    flexGrow: 1,
  },
  listHeader: {
    marginBottom: spacing.lg,
  },
  listTitle: {
    fontSize: fontSizes.lg,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs / 2,
  },
  listSubtitle: {
    fontSize: fontSizes.sm,
    color: colors.muted,
    fontWeight: '500',
  },
  txRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  txLeft: {
    flex: 1,
    marginRight: spacing.lg,
  },
  txHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
    gap: spacing.sm,
  },
  txAmount: {
    fontSize: fontSizes.lg,
    fontWeight: '700',
  },
  txTypeIndicator: {
    padding: spacing.xs / 2,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txDesc: {
    fontSize: fontSizes.sm,
    color: colors.muted,
    fontStyle: 'italic',
  },
  txRight: {
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  txDateContainer: {
    alignItems: 'flex-end',
  },
  txDate: {
    fontSize: fontSizes.sm,
    color: colors.text,
    fontWeight: '600',
  },
  txTime: {
    fontSize: fontSizes.sm,
    color: colors.muted,
  },
  txAccountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    maxWidth: 120,
  },
  accountIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  txAccount: {
    fontSize: fontSizes.sm,
    color: colors.primary,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl * 2,
    gap: spacing.md,
  },
  emptyTitle: {
    fontSize: fontSizes.lg,
    fontWeight: '600',
    color: colors.text,
  },
  emptyText: {
    fontSize: fontSizes.md,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
  },
})
