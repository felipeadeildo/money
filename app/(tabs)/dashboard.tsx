import { LinearGradient } from 'expo-linear-gradient'
import { nanoid } from 'nanoid/non-secure'
import { useState } from 'react'
import { SafeAreaView, StatusBar, View } from 'react-native'

import { AccountFilter } from '@/src/components/AccountFilter'
import { AddTransactionModal } from '@/src/components/AddTransactionModal'
import { DashboardHeader } from '@/src/components/DashboardHeader'
import { FloatingActionButton } from '@/src/components/FloatingActionButton'
import { TransactionsList } from '@/src/components/TransactionsList'
import { useAccounts } from '@/src/hooks/useAccounts'
import { useTransactions } from '@/src/hooks/useTransactions'
import { colors } from '@/src/theme'

export default function DashboardScreen() {
  const { accounts } = useAccounts()
  const [selectedAccount, setSelectedAccount] = useState<string | undefined>()
  const [page, setPage] = useState(1)
  const [showAddModal, setShowAddModal] = useState(false)
  const [saving, setSaving] = useState(false)

  const pageSize = 20
  const { transactions, loading, total, refresh } = useTransactions({
    accountId: selectedAccount,
    page,
    pageSize,
  })

  const handleSelectAccount = (accountId?: string) => {
    setSelectedAccount(accountId)
    setPage(1)
  }

  const handleLoadMore = () => {
    if (transactions.length < total && !loading) {
      setPage((p) => p + 1)
    }
  }

  const handleAddTransaction = async (
    amount: number,
    description: string,
    accountId: string
  ) => {
    setSaving(true)
    try {
      const { createTransaction } = await import('../../src/db/transactions')
      await createTransaction({
        id: nanoid(),
        amount,
        date: new Date().toISOString(),
        fromAccountId: accountId,
        description: description || undefined,
      })

      setShowAddModal(false)
      refresh()
    } catch (error) {
      console.error('Error creating transaction:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      <LinearGradient
        colors={[colors.background, colors.surface]}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          {/* Header */}
          <DashboardHeader totalTransactions={total} />

          {/* Transactions List */}
          <View style={{ flex: 1 }}>
            <AccountFilter
              accounts={accounts}
              selectedAccount={selectedAccount}
              onSelectAccount={handleSelectAccount}
            />

            <TransactionsList
              transactions={transactions}
              accounts={accounts}
              loading={loading}
              total={total}
              onRefresh={refresh}
              onLoadMore={handleLoadMore}
            />
          </View>

          {/* Floating Action Button */}
          <FloatingActionButton onPress={() => setShowAddModal(true)} />

          {/* Add Transaction Modal */}
          <AddTransactionModal
            visible={showAddModal}
            onClose={() => setShowAddModal(false)}
            onAdd={handleAddTransaction}
            accounts={accounts}
            loading={saving}
          />
        </SafeAreaView>
      </LinearGradient>
    </View>
  )
}
